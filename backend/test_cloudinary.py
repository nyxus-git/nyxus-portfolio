# backend/test_cloudinary.py

import cloudinary
import cloudinary.uploader
import os

# --- REPLACE WITH YOUR ACTUAL CLOUDINARY CREDENTIALS ---
# These MUST be the exact ones from your dashboard (NyxusPortfolio, API Key, API Secret)
CLOUD_NAME = "NyxusPortfolio"
API_KEY = "912398426541128"
API_SECRET = "H70ogrmUKXEoJnLZ65xDqAnoImM"
# --- END CREDENTIALS ---

cloudinary.config(
    cloud_name=CLOUD_NAME,
    api_key=API_KEY,
    api_secret=API_SECRET
)

print(f"Attempting to configure Cloudinary with:")
print(f"  Cloud Name: {cloudinary.config().cloud_name}")
print(f"  API Key: {cloudinary.config().api_key}")
print(f"  API Secret (first 5 chars): {cloudinary.config().api_secret[:5]}...")

# Create a dummy image file for testing
dummy_image_path = "dummy_image.txt"
with open(dummy_image_path, "w") as f:
    f.write("This is a dummy file for Cloudinary upload test.")

try:
    print(f"\nAttempting to upload '{dummy_image_path}' to Cloudinary...")
    # Upload the dummy file
    # Cloudinary can infer content type, but for a dummy .txt, it might complain
    # Let's try to simulate a real image upload by providing a resource_type
    upload_result = cloudinary.uploader.upload(
        dummy_image_path,
        resource_type="raw", # Use "raw" for non-image files like text, or "image" for actual images
        folder="test_folder" # Optional: upload to a specific folder
    )

    print("\n--- UPLOAD SUCCESSFUL! ---")
    print(f"Secure URL: {upload_result['secure_url']}")
    print(f"Public ID: {upload_result['public_id']}")
    print("--------------------------")

    # Optional: Clean up the dummy file
    os.remove(dummy_image_path)
    print(f"Cleaned up {dummy_image_path}")

    # Optional: Delete from Cloudinary immediately
    # cloudinary.uploader.destroy(upload_result['public_id'], resource_type="raw")
    # print(f"Deleted {upload_result['public_id']} from Cloudinary.")

except cloudinary.exceptions.AuthorizationRequired as e:
    print(f"\n--- CLOUDINARY AUTHORIZATION ERROR ---")
    print(f"Error: {e}")
    print("This usually means your Cloudinary credentials (Cloud Name, API Key, API Secret) are incorrect or your account is not active.")
    print("Please double-check them on your Cloudinary Dashboard.")
    print("--------------------------------------")
except Exception as e:
    import traceback
    print(f"\n--- AN UNEXPECTED ERROR OCCURRED ---")
    traceback.print_exc()
    print(f"Error: {e}")
    print("This could be a network issue, a problem with the file, or another Cloudinary API error.")
    print("------------------------------------")
finally:
    if os.path.exists(dummy_image_path):
        os.remove(dummy_image_path)