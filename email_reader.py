from flask import Flask, jsonify
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import pickle
import os.path
import base64
from bs4 import BeautifulSoup

# Flask app setup
app = Flask(__name__)

# Define the SCOPES. If modifying it, delete the token.pickle file.
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

def get_emails():
    creds = None
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    # Connect to Gmail API
    service = build('gmail', 'v1', credentials=creds)
    result = service.users().messages().list(userId='me', maxResults=10, q='is:unread').execute()
    messages = result.get('messages', [])

    email_list = []
    for msg in messages:
        txt = service.users().messages().get(userId='me', id=msg['id']).execute()
        payload = txt.get('payload', {})
        headers = payload.get('headers', [])
        subject = next((d['value'] for d in headers if d['name'] == 'Subject'), "No Subject")
        sender = next((d['value'] for d in headers if d['name'] == 'From'), "Unknown Sender")
        
        # Decode email body
        body = None
        parts = payload.get('parts', [])
        if parts:
            data = parts[0].get('body', {}).get('data', '')
            if data:
                data = data.replace("-", "+").replace("_", "/")
                decoded_data = base64.b64decode(data)
                body = BeautifulSoup(decoded_data, "lxml").get_text()

        email_list.append({
            'subject': subject,
            'sender': sender,
            'body': body
        })

    return email_list

@app.route('/api/emails', methods=['GET'])
def get_emails_api():
    emails = get_emails()
    return jsonify(emails)

if __name__ == '__main__':
    app.run(debug=True)
