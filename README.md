# Test_Project_Software_Engineering_Anti_Kaspi

## Description: 
    This is git repository for online shop web-api with front-end and back-end.
---
## Frameworks:
    Django 6+
    Angular
---
## Goal: 
    Prototyping an app for browsing goods by category.
---
## Acceptance criteria

1. From the home page, a user can select a category returned by the API and see its products. If the list is empty, the page displays an empty-list message.
2. Each product card displays its image, name, description, rating, and price in KZT. Selecting the product name follows its product link.
3. Selecting a product's like button increases the displayed like count by one for that card. The count is kept in the current view and is not saved to the backend.
4. Selecting a product's remove button asks for confirmation. Confirming removes that product from the current list; cancelling leaves it in the list. Refreshing reloads products from the API.
5. The Django API provides product and category list and detail endpoints under `/api/`. A request to `/api/categories/<category_id>/products/` returns that category's products, or HTTP 404 if the category does not exist. The Angular catalog loads categories and products from these endpoints.

---
## Structure:
    Product data is stored in PostgreSQL; Django provides it to Angular via REST.
    shop_front_angular is angular place.
    shop_api and shop_back are parts of django.
---
## Local setup

Install Django, Django REST Framework, django-filter, and a PostgreSQL driver in a local Python environment. Configure PostgreSQL and set `DJANGO_SECRET_KEY`, `POSTGRES_DB`, `POSTGRES_USER`, and `POSTGRES_PASSWORD` as environment variables. Optional settings are `POSTGRES_HOST`, `POSTGRES_PORT`, `DJANGO_ALLOWED_HOSTS` (comma-separated), and `DJANGO_DEBUG` (`true` for local debug mode). Do not commit credentials. Apply migrations with `python manage.py migrate`, populate categories and products in the database, and start Django with `python manage.py runserver`. A staff superuser can manage catalog data at `/admin/`.

In `shop_front_angular`, run `npm install` and `npm start`. The Angular development server proxies `/api/` requests to Django at `127.0.0.1:8000`. The old bundled JSON is not automatically imported into PostgreSQL. Run frontend tests with `npm test` and backend tests with `python manage.py test` using an appropriately configured test database.

The existing database password and Django secret key were previously stored in source. Rotate them and assess any repository history containing them.

---
## Class structure:
    Categories <- Category <- product(Angular side)
    Product <-> Products -> Category <-> Categories
---
## Classes technical details (Angular):
    Category: 
       GraphicCards: Product[];
       Phones: Product[];
       Furniture: Product[];
       Shoes: Product[];
    Product: 
     {
        id: string;
        label: string;
        description: string;
        price: number;
        link: string;
        rating: number;
        imageUrl: string;
        likes: number;
     }
     - Both are interfaces.
---
## Django models structure:
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
### Serialization: 
    class CategorySerializer(serializers.ModelSerializer):
       class Meta:
        model = Category
        fields = ['name']

    class ProductSerializer(serializers.ModelSerializer):
      category = serializers.StringRelatedField()

      class Meta:
        model = Product
        fields = "__all__"
--- 
### Views of django:
They are all created using generics:

ProductsListAPIView - ListCreateAPIView

ProductDetailAPIView = RetrieveUpdateDestroyAPIView

CategoryListAPIView = ListCreateAPIView

CategoryDetailAPIView = RetrieveUpdateDestroyAPIView:
     
     lookup_url_kwarg = 'category_id'
     lookup_field = 'name'

CategoryProductsAPIView = APIView :

    def get(self, request, category_id):
        try:
            category = Category.objects.get(name=category_id)
        except Category.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        products = Product.objects.filter(category_name=category)
        serializer = ProductSerializer(products, many=True)

        return Response(serializer.data)
---
## Endpoints of django:
      /products/
      /products/product_id/
      /categories/
      /categories/category_id/
      /categories/category_id/products
