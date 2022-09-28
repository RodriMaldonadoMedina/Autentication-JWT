"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt


api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST','GET'])
def handleHello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()  #request es lo que yo envio desde el frontend
    user = User.query.filter_by(email = data.get("email")).first()
    if user is not None:
        return jsonify({"mensaje": "El usuario ya existe"}), 404
    new_user = User(
        email = data.get("email"), 
        password = data.get("password"),
        is_active = True
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.serialize()),200 #siempre devolver un formato json
   
@api.route("/login", methods=['POST'])
def login():
    data = request.get_json()
    # email = request.json.get("email",None)
    # password = request.json.get("password",None)
    user = User.query.filter_by(email = data.get("email"), password = data.get("password")).first()
    if user is None:
        return jsonify({"mensaje": "El usuario no existe"}), 401
    access_token = create_access_token(identity=user.id)
    return jsonify({ "token": access_token, "user_id": user.id }),200
    
@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # Accede a la identidad del usuario actual con get_jwt_identity
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify({"id": user.id, "email": user.email }), 200

@api.route('/logout', methods=['DELETE'])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    return jsonify({"msg": "Successfully logged out"}), 200