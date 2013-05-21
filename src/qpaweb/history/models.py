from django.db import models

# Create your models here.

class Vertex(models.Model):
    name = models.CharField(max_length=30)
    x = models.DecimalField()
    y = models.DecimalField()

class Arrow(models.Model):
    name = models.CharField(max_length=30)
    v1 = models.ForeignKey(Vertex)
    v2 = models.ForeignKey(Vertex)
    
class Quiver(models.Model):
    name = models.CharField(max_length=30)
    vList = models.ManyToManyField(Vertix)
    aList = models.ManyToManyField(Arrow)