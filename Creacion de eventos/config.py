class Config:

    SECRET_KEY = 'clave123'

    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:@localhost/eventos_db'

    SQLALCHEMY_TRACK_MODIFICATIONS = False