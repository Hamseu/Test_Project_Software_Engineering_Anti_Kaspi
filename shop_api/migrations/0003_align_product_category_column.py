from django.db import migrations, models
import django.db.models.deletion


def align_column(apps, schema_editor, source, target):
    Product = apps.get_model('shop_api', 'Product')
    with schema_editor.connection.cursor() as cursor:
        columns = {
            column.name
            for column in schema_editor.connection.introspection.get_table_description(
                cursor, Product._meta.db_table
            )
        }
    if source in columns and target not in columns:
        quote = schema_editor.quote_name
        schema_editor.execute(
            f'ALTER TABLE {quote(Product._meta.db_table)} '
            f'RENAME COLUMN {quote(source)} TO {quote(target)}'
        )
    elif target not in columns or source in columns:
        raise RuntimeError('Cannot reconcile product category columns; inspect the products table.')


def forwards(apps, schema_editor):
    align_column(apps, schema_editor, 'category_name_id', 'category_name')


def backwards(apps, schema_editor):
    align_column(apps, schema_editor, 'category_name', 'category_name_id')


class Migration(migrations.Migration):
    dependencies = [('shop_api', '0002_rename_category_product_category_name_and_more')]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[migrations.RunPython(forwards, backwards)],
            state_operations=[migrations.AlterField(
                model_name='product',
                name='category_name',
                field=models.ForeignKey(
                    db_column='category_name', on_delete=django.db.models.deletion.CASCADE,
                    related_name='products', to='shop_api.category', to_field='name',
                ),
            )],
        ),
    ]
