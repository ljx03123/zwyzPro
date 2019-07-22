# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2019-07-12 06:17
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('App', '0003_auto_20190712_1112'),
    ]

    operations = [
        migrations.CreateModel(
            name='Cart',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('num', models.IntegerField(default=1)),
                ('is_select', models.BooleanField(default=True)),
                ('goods_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='App.Goods')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='App.User')),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order_id', models.CharField(max_length=50, unique=True)),
                ('order_create', models.DateTimeField(auto_now_add=True)),
                ('order_status', models.IntegerField(default=0)),
                ('order_price', models.FloatField(default=0)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='App.User')),
            ],
        ),
        migrations.CreateModel(
            name='OrderGoods',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('num', models.IntegerField()),
                ('goods_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='App.Goods')),
                ('order_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='App.Order')),
            ],
        ),
    ]
