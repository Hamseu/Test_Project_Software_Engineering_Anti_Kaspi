# Test_Project_Software_Engineering_Anti_Kaspi

## Description
This is git repository for online shop web-api with front-end and back-end.
---
## Frameworks:
Django 6+
Angular
---
## Goal: 
Prototyping the app which could provide comfortable search for goods.
---
## Structure:
App is hardly linked to goods on kaspi, it doesn't fetch anything and every item is hardcoded to db. Backend side is made with django and connects to Angular frontend via REST. 
Dev mode is on.
Secure is off.
shop_front_angular is angular place.
shop_api and shop_back are parts of django.
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

Both are interfaces.
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
