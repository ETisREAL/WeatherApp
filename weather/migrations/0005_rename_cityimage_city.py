# Generated by Django 4.1.2 on 2022-11-28 08:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("weather", "0004_alter_cityimage_image"),
    ]

    operations = [
        migrations.RenameModel(old_name="CityImage", new_name="City",),
    ]
