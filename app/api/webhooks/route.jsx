import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { createOrUpdateUser, deleteUser  } from '@lib/actions/user'

async function handleUserEvent(userData) {
  const userData1 ={
    "first_name":"Facundo",
    "email_addresses": [
      {
        "created_at": 1715645274566,
        "email_address": "facundoaylan3@gmail.com",
        "id": "idn_2gR0qcEM3kCVx1mNYNrjNrowvqL",
        "linked_to": [
          {
            "id": "idn_2gR0qeUNYE6QXKJqa1dENnnkBvA",
            "type": "oauth_google"
          }
        ],
        "object": "email_address",
        "reserved": false,
        "updated_at": 1715645280807,
        "verification": {
          "attempts": null,
          "expire_at": null,
          "status": "verified",
          "strategy": "from_oauth_google"
        }
      }
    ],

    "id": "user_2gR0rOWvX77FZ91ghfT4QVzfEgG",
    "image_url": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yZ1IwclFOelpVZzdoTWlCZlBjQmhrSXRUd3cifQ",
    "last_name": "Aylan",
    "username": "fakugsb",
  }
  const { id, first_name, last_name, image_url, email_addresses, username } = userData1;
  await createOrUpdateUser(userData1);
}

export async function POST(req) {

  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    })
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }


  const eventType = evt.type;
  if(eventType === 'user.created'|| eventType === "user.updated"){
    try {
      handleUserEvent(evt.data);
      return new Response("User is created or updated", {
        status: 200,
      });
    } catch (err) {
      console.error("Error creating or updating user:", err);
      return new Response("Error occured", {
        status: 500,
      });
    }

  }
}