from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('api', '0005_eventregistration'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='balance',
            field=models.DecimalField(max_digits=10, decimal_places=2, default=0),
        ),
    ] 