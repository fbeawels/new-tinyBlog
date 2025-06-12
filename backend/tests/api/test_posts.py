import pytest
from fastapi.testclient import TestClient


@pytest.mark.asyncio
async def test_create_post(test_client, db_client, test_superuser):
    # First create a test user and get token
    import uuid
    unique_id = str(uuid.uuid4())[:8]
    user_data = {
        "email": f"post_test_{unique_id}@example.com",
        "username": f"post_test_{unique_id}",
        "password": f"testpassword_{unique_id}",
        "full_name": f"Post Test {unique_id}"
    }
    print(f"Creating test user with email: {user_data['email']}")
    
    # Register the user
    response = test_client.post("/api/v1/auth/register", json=user_data)
    print(f"Register response: {response.status_code} - {response.text}")
    assert response.status_code == 201, f"Failed to register user: {response.text}"
    user_id = response.json().get("id")
    print(f"Registered user ID: {user_id}")
    
    # Login to get token
    login_data = {
        "username": user_data["username"],
        "password": user_data["password"]
    }
    response = test_client.post("/api/v1/auth/login", data=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create a category first - use superuser for this
    category_name = f"Test Category {unique_id}"
    category_data = {
        "name": category_name,
        "description": f"A test category for posts {unique_id}"
    }
    print(f"Creating test category: {category_name}")
    response = test_client.post(
        "/api/v1/categories/", 
        json=category_data, 
        headers=test_superuser  # Use superuser headers
    )
    assert response.status_code == 200, f"Failed to create category: {response.text}"
    category_id = response.json()["id"]
    
    # Create test tags first
    tag_names = ["test", "api"]
    tag_ids = []
    
    for tag_name in tag_names:
        tag_data = {
            "name": f"{tag_name}_{unique_id}",
            "description": f"Test tag {tag_name} for post testing"
        }
        response = test_client.post(
            "/api/v1/tags/",
            json=tag_data,
            headers=test_superuser
        )
        assert response.status_code == 200, f"Failed to create tag {tag_name}: {response.text}"
        tag_ids.append(response.json()["id"])
    
    # Create a post with the created tags
    post_data = {
        "title": f"Test Post {unique_id}",
        "text": "This is a test post content",
        "category_id": category_id,
        "tags": tag_ids
    }
    
    # Debug: Afficher les détails de la requête
    print("\n=== Détails de la requête de création de post ===")
    print(f"URL: /api/v1/posts/")
    print(f"Headers: {headers}")
    print(f"Données: {post_data}")
    
    # Envoyer la requête de création de post
    response = test_client.post("/api/v1/posts/", json=post_data, headers=headers)
    
    # Debug: Afficher la réponse complète
    print("\n=== Réponse de l'API ===")
    print(f"Status code: {response.status_code}")
    print(f"Contenu: {response.text}")
    
    assert response.status_code == 201, f"Échec de la création du post: {response.text}"
    created_post = response.json()
    
    # Vérifier que la réponse contient les données attendues
    assert created_post["title"] == post_data["title"]
    assert created_post["text"] == post_data["text"], f"Le champ 'text' ne correspond pas. Attendu: {post_data['text']}, Reçu: {created_post.get('text')}"
    assert created_post["author_id"] == user_id, f"L'ID de l'auteur ne correspond pas. Attendu: {user_id}, Reçu: {created_post.get('author_id')}"
    assert created_post["category_id"] == category_id, f"L'ID de la catégorie ne correspond pas. Attendu: {category_id}, Reçu: {created_post.get('category_id')}"
    assert set(created_post["tags"]) == set(post_data["tags"]), f"Les tags ne correspondent pas. Attendu: {set(post_data['tags'])}, Reçu: {set(created_post.get('tags', []))}"
    
    # Try to create a post without authentication
    response = test_client.post("/api/v1/posts/", json=post_data)
    assert response.status_code == 401
    
    # Try to create a post with invalid data
    invalid_post = {"title": ""}
    response = test_client.post("/api/v1/posts/", json=invalid_post, headers=headers)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_get_posts(test_client, db_client, test_superuser):
    # First create a test user and get token
    user_data = {
        "email": "get_posts_test@example.com",
        "username": "get_posts_test",
        "password": "testpassword",
        "full_name": "Get Posts Test"
    }
    
    # Register the user
    response = test_client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 201
    
    # Login to get token
    login_data = {
        "username": user_data["username"],
        "password": user_data["password"]
    }
    response = test_client.post("/api/v1/auth/login", data=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create a category using superuser
    category_data = {
        "name": "Get Posts Category",
        "description": "A category for get posts test"
    }
    response = test_client.post(
        "/api/v1/categories/", 
        json=category_data, 
        headers=test_superuser  # Use superuser headers
    )
    assert response.status_code == 200, f"Failed to create category: {response.text}"
    category_id = response.json()["id"]
    
    # Create multiple posts
    for i in range(3):
        post_data = {
            "title": f"Test Post {i}",
            "content": f"This is test post {i} content",
            "category_id": category_id,
            "tags": ["test", f"tag{i}"]
        }
        response = test_client.post("/api/v1/posts/", json=post_data, headers=headers)
        print(f"Create post response: {response.status_code} - {response.text}")
        assert response.status_code == 201, f"Failed to create post: {response.text}"
    
    # Get all posts
    response = test_client.get("/api/v1/posts/")
    assert response.status_code == 200
    posts = response.json()
    assert len(posts) >= 3
    
    # Get posts with pagination
    response = test_client.get("/api/v1/posts/?skip=0&limit=2")
    assert response.status_code == 200
    paginated_posts = response.json()
    assert len(paginated_posts) == 2
    
    # Get posts by category
    response = test_client.get(f"/api/v1/posts/?category_id={category_id}")
    assert response.status_code == 200
    category_posts = response.json()
    assert len(category_posts) >= 3
    for post in category_posts:
        assert post["category_id"] == category_id


@pytest.mark.asyncio
async def test_get_update_delete_post(test_client, db_client, test_superuser):
    # First create a test user and get token
    user_data = {
        "email": "crud_post_test@example.com",
        "username": "crud_post_test",
        "password": "testpassword",
        "full_name": "CRUD Post Test"
    }
    
    # Register the user
    response = test_client.post("/api/v1/auth/register", json=user_data)
    assert response.status_code == 201
    
    # Login to get token
    login_data = {
        "username": user_data["username"],
        "password": user_data["password"]
    }
    response = test_client.post("/api/v1/auth/login", data=login_data)
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create a category using superuser
    category_data = {
        "name": "CRUD Posts Category",
        "description": "A category for CRUD posts test"
    }
    response = test_client.post(
        "/api/v1/categories/", 
        json=category_data, 
        headers=test_superuser  # Use superuser headers
    )
    assert response.status_code == 200, f"Failed to create category: {response.text}"
    category_id = response.json()["id"]
    
    # Create a post
    post_data = {
        "title": "CRUD Test Post",
        "content": "This is a CRUD test post content",
        "category_id": category_id,
        "tags": ["crud", "test"]
    }
    response = test_client.post("/api/v1/posts/", json=post_data, headers=headers)
    assert response.status_code == 201
    post_id = response.json()["id"]
    
    # Get the post by ID
    response = test_client.get(f"/api/v1/posts/{post_id}")
    assert response.status_code == 200
    post = response.json()
    assert post["id"] == post_id
    assert post["title"] == post_data["title"]
    
    # Update the post
    update_data = {
        "title": "Updated CRUD Test Post",
        "content": "This is the updated content"
    }
    response = test_client.put(f"/api/v1/posts/{post_id}", json=update_data, headers=headers)
    assert response.status_code == 200
    updated_post = response.json()
    assert updated_post["id"] == post_id
    assert updated_post["title"] == update_data["title"]
    assert updated_post["content"] == update_data["content"]
    
    # Try to update without authentication
    response = test_client.put(f"/api/v1/posts/{post_id}", json=update_data)
    assert response.status_code == 401
    
    # Delete the post
    response = test_client.delete(f"/api/v1/posts/{post_id}", headers=headers)
    assert response.status_code == 204
    
    # Verify the post is deleted
    response = test_client.get(f"/api/v1/posts/{post_id}")
    assert response.status_code == 404
