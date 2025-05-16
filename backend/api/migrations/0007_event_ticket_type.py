from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('api', '0006_user_balance'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='ticket_type',
            field=models.ForeignKey(null=True, blank=True, to='api.tickettype', on_delete=models.CASCADE),
        ),
    ] 