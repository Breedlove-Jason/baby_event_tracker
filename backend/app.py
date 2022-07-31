from datetime import datetime
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://jason:QJF46*8T.dtnYeLEX7*sh@localhost/baby-tracker'
db = SQLAlchemy(app)
CORS(app)


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"Event {self.description}"

    def __init__(self, description):
        self.description = description


def format_event(event):
    return {
        'id': event.id,
        'description': event.description,
        'created_at': event.created_at.isoformat()
    }


@app.route('/')
def hello_world():
    return 'Hello World!'


# create the event
@app.route('/events', methods=['POST'])
def create_event():
    description = request.json['description']
    event = Event(description)
    db.session.add(event)
    db.session.commit()
    return format_event(event)


# get all events
@app.route('/events', methods=['GET'])
def get_events():
    events = Event.query.order_by(Event.id.asc()).all()
    event_list = []
    for event in events:
        event_list.append(format_event(event))
    return {'events': event_list}


# get single event
@app.route('/events/<id>', methods=['GET'])
def get_event(id):
    event = Event.query.filter_by(id=id).one()
    formatted_event = format_event(event)
    return {'event': formatted_event}


# delete event
@app.route('/events/<id>', methods=['DELETE'])
def delete_event(id):
    event = Event.query.filter_by(id=id).one()
    db.session.delete(event)
    db.session.commit()
    return {'message': f'Event (id: {id})deleted'}


# edit event
@app.route('/events/<id>', methods=['PUT'])
def update_event(id):
    event = Event.query.filter_by(id=id)
    description = request.json['description']
    event.update(dict(description=description, created_at=datetime.utcnow()))
    db.session.commit()
    return {'event': format_event(event.one())}


if __name__ == '__main__':
    app.run()
