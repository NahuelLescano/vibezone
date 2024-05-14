import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { createOrUpdateUser, deleteUser  } from '@lib/actions/user'

async function handleUserEvent(userData) {
  const userData1 ={
    "backup_code_enabled": false,
    "banned": false,
    "create_organization_enabled": true,
    "created_at": 1715645280775,
    "delete_self_enabled": true,
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
    "external_accounts": [
      {
        "approved_scopes": "email https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid profile",
        "created_at": 1715645274533,
        "email_address": "facundoaylan3@gmail.com",
        "family_name": "Aylan",
        "given_name": "Facundo",
        "google_id": "110695981003644409130",
        "id": "idn_2gR0qeUNYE6QXKJqa1dENnnkBvA",
        "label": null,
        "object": "google_account",
        "picture": "https://lh3.googleusercontent.com/a/ACg8ocJem-ZCLuT7Mm6kiVGkNcXczA6GPQ44wXx-VAmTeTIPRbe74CE=s1000-c",
        "public_metadata": {},
        "updated_at": 1715645274533,
        "username": null,
        "verification": {
          "attempts": null,
          "expire_at": 1715645867298,
          "status": "verified",
          "strategy": "oauth_google"
        }
      }
    ],
    "external_id": null,
    "first_name": "Facundo",
    "has_image": true,
    "id": "user_2gR0rOWvX77FZ91ghfT4QVzfEgG",
    "image_url": "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yZ1IwclFOelpVZzdoTWlCZlBjQmhrSXRUd3cifQ",
    "last_active_at": 1715645280774,
    "last_name": "Aylan",
    "last_sign_in_at": null,
    "locked": false,
    "lockout_expires_in_seconds": null,
    "object": "user",
    "passkeys": [],
    "password_enabled": false,
    "phone_numbers": [],
    "primary_email_address_id": "idn_2gR0qcEM3kCVx1mNYNrjNrowvqL",
    "primary_phone_number_id": null,
    "primary_web3_wallet_id": null,
    "private_metadata": {},
    "profile_image_url": "https://images.clerk.dev/oauth_google/img_2gR0rQNzZUg7hMiBfPcBhkItTww",
    "public_metadata": {},
    "saml_accounts": [],
    "totp_enabled": false,
    "two_factor_enabled": false,
    "unsafe_metadata": {},
    "updated_at": 1715645280853,
    "username": "fakugsb",
    "verification_attempts_remaining": 100,
    "web3_wallets": []
  }
  const { id, first_name, last_name, image_url, email_addresses, username } = userData1;
  await createOrUpdateUser(id, first_name, last_name, image_url, email_addresses, username);
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