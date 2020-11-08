## Backend for engineering thesis application
### Requirements
- Python 3
- Microsoft C++ Build Tools: https://visualstudio.microsoft.com/visual-cpp-build-tools/
- mysqlclient (`pip install mysqlclient`)
- Django (`pip install django`)
- Django CORS Headers (`pip install django-cors-headers`)

### Running backend
`python manage.py runserver`

To stop it use Ctrl+C. Stopping and re-running is required to introduce recent changes in the code to the app.

### Syncing models with database
 `python manage.py makemigrations Backend` - detects changes
 `python manage.py migrate Backend` - does the changes
 `python manage.py sqlmigrate app_label migration_name` - shows sql code run during the migration