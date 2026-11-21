from decimal import Decimal
from importlib import import_module
from types import SimpleNamespace
from unittest.mock import MagicMock
from django.db import connection
from django.test import SimpleTestCase, TestCase
from rest_framework.test import APIClient
from .models import Category, Product


class CategoryColumnMigrationTests(SimpleTestCase):
    def setUp(self):
        self.migration = import_module('shop_api.migrations.0003_align_product_category_column')
        self.apps = MagicMock()
        self.apps.get_model.return_value._meta.db_table = 'products'
        self.editor = MagicMock()
        self.editor.quote_name.side_effect = lambda name: f'"{name}"'

    def set_columns(self, *names):
        self.editor.connection.introspection.get_table_description.return_value = [
            SimpleNamespace(name=name) for name in names
        ]

    def test_renames_old_column(self):
        self.set_columns('category_name_id')
        self.migration.forwards(self.apps, self.editor)
        self.editor.execute.assert_called_once_with(
            'ALTER TABLE "products" RENAME COLUMN "category_name_id" TO "category_name"'
        )

    def test_existing_target_column_is_left_alone(self):
        self.set_columns('category_name')
        self.migration.forwards(self.apps, self.editor)
        self.editor.execute.assert_not_called()

    def test_ambiguous_or_missing_columns_fail_safely(self):
        for names in [(), ('category_name', 'category_name_id')]:
            with self.subTest(names=names):
                self.set_columns(*names)
                with self.assertRaises(RuntimeError):
                    self.migration.forwards(self.apps, self.editor)
        self.editor.execute.assert_not_called()


class CatalogApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(name='Phones')
        Product.objects.create(
            external_id='phone-1', name='Phone', description='A phone',
            price=Decimal('100.00'), link='https://example.com',
            rating=None, image_url='', category_name=self.category,
        )
        other = Category.objects.create(name='Shoes')
        Product.objects.create(external_id='shoe-1', name='Shoe', price=1, category_name=other)

    def test_category_products_are_filtered_and_serialized(self):
        response = self.client.get('/api/categories/Phones/products/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Phone')
        self.assertEqual(response.data[0]['price'], '100.00')
        self.assertIsNone(response.data[0]['rating'])

    def test_unknown_category_returns_404(self):
        self.assertEqual(self.client.get('/api/categories/Unknown/products/').status_code, 404)

    def test_product_category_column_matches_model(self):
        with connection.cursor() as cursor:
            columns = {column.name for column in connection.introspection.get_table_description(cursor, 'products')}
        self.assertIn('category_name', columns)
        self.assertNotIn('category_name_id', columns)
        self.assertEqual(Product._meta.get_field('category_name').column, 'category_name')

    def test_lists_categories_and_products(self):
        self.assertEqual(len(self.client.get('/api/categories/').data), 2)
        self.assertEqual(len(self.client.get('/api/products/').data), 2)
