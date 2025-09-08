class DatabaseRouter:
    """
    Database router for sharding users and messages across different databases
    """
    
    route_app_labels = {'authentication', 'chat', 'ai', 'media', 'notifications'}

    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'authentication':
            return 'users_db'
        elif model._meta.app_label == 'chat':
            return 'messages_db'
        return 'default'

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'authentication':
            return 'users_db'
        elif model._meta.app_label == 'chat':
            return 'messages_db'
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        db_set = {'default', 'users_db', 'messages_db'}
        if obj1._state.db in db_set and obj2._state.db in db_set:
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label == 'authentication':
            return db == 'users_db'
        elif app_label == 'chat':
            return db == 'messages_db'
        elif db in ('users_db', 'messages_db'):
            return False
        return db == 'default'