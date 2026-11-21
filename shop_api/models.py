from django.db import models

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=100, primary_key=True)

    class Meta:
        db_table = 'categories'
    def __str__(self):
        return self.name


class Product(models.Model):
    external_id = models.CharField(max_length=50)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    link = models.TextField(blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, null=True)
    image_url = models.TextField(blank=True)
    quantity = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    category_name = models.ForeignKey(
        Category,
        to_field="name",
        on_delete=models.CASCADE,
        related_name="products",
        db_column = "category_name"
    )

    def __str__(self):
        return self.name
    class Meta:
        db_table = 'products'
