"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token


api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST','GET'])
def handleHello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    user = User.query.filter_by(email = data.get("email")).first()
    if user is not None:
        return "El usuario ya existe", 404
    new_user = User(
        email = data.get("email"), 
        password = data.get("password"),
        is_active = True
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.serialize()),200
   
@api.route("/login", methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email = data.get("email"), password = data.get("password")).first()
    if user is None:
        return "El usuario no existe", 401
    access_token = create_access_token(identity=user.id)
    return jsonify({ "token": access_token, "user_id": user.id }),200
    
