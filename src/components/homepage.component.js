import React, {useEffect, useState} from 'react';
import { styled } from '@mui/system';
import { Button, Modal, TextField, Input } from '@mui/material';
import './styles/Homepage.css';
import RecipeModal from "./recipe.component";
import { useCookies } from 'react-cookie';

const url=`http://localhost:4000`;

const RecipeGrid = styled('div')({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
});

const RecipeCard = styled('div')({
    textAlign: 'center',
    margin: '10px'
});
const featuredRecipes = [
    {
        id: 1,
        name: 'Pasta Carbonara',
        image: 'https://picsum.photos/200/100',
        description: 'Classic Italian pasta dish with creamy sauce.',
        cooking_time: '30 minutes',
        difficulty: 'Intermediate',
        serving_size: 2,
        calories: 500,
        fat: 25.5,
        carbohydrates: 45.2,
        protein: 18.7,
    },
    {
        id: 2,
        name: 'Pasta Carbonara',
        image: 'https://picsum.photos/200/100',
        description: 'Classic Italian pasta dish with creamy sauce.',
        cooking_time: '30 minutes',
        difficulty: 'Intermediate',
        serving_size: 2,
        calories: 500,
        fat: 25.5,
        carbohydrates: 45.2,
        protein: 18.7,
    },
    {
        id: 3,
        name: 'Pasta Carbonara',
        image: 'https://picsum.photos/200/200',
        description: 'Classic Italian pasta dish with creamy sauce.',
        cooking_time: '30 minutes',
        difficulty: 'Intermediate',
        serving_size: 2,
        calories: 500,
        fat: 25.5,
        carbohydrates: 45.2,
        protein: 18.7,
    },
    {
        id: 4,
        name: 'Chicken Stir-Fry',
        image: 'https://picsum.photos/200/300',
        description: 'Quick and flavorful chicken stir-fry with vegetables.',
        cooking_time: '20 minutes',
        difficulty: 'Easy',
        serving_size: 4,
        calories: 320,
        fat: 12.3,
        carbohydrates: 28.8,
        protein: 26.5,
    },
    {
        id: 5,
        name: 'Banana Bread',
        image: 'https://picsum.photos/200/400',
        description: 'Moist and delicious banana bread with walnuts.',
        cooking_time: '1 hour',
        difficulty: 'Easy',
        serving_size: 8,
        calories: 240,
        fat: 8.9,
        carbohydrates: 37.2,
        protein: 4.6,
    },
];
const ModalContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    width: '50vh'
});

const ModalContent = styled('div')({
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '8px',
    outline: 'none',
});

const HomePage = () => {
    const [open, setOpen] = useState(false);
    const [recipeCollections, setRecipeCollections] = React.useState([]);
    const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null;
    const [picture, setPicture] = useState({});
    const [recipes, setRecipes] = useState([]);


    const [newRecipe, setNewRecipe] = useState({
        name: '',
        description: '',
        cooking_time: '',
        difficulty: '',
        serving_size: '',
        calories: '',
        fat: '',
        carbohydrates: '',
        protein: '',
        image:''
    });
    const uploadPicture = (e) => {
        setPicture({
            /* contains the preview, if you want to show the picture to the user
                 you can access it with this.state.currentPicture
             */
            picturePreview: URL.createObjectURL(e.target.files[0]),
            /* this contains the file we want to send */
            pictureAsFile: e.target.files[0],
        });
    };
    const handleSearch = (e) => {
        const searchTerm = e.target.value;
        console.log('Searching for:', searchTerm);
    };
    useEffect(() => {
        const fetchMyRecipes = async () => {
            try {
                const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null;
                const token = localStorage.getItem('user')? JSON.parse(localStorage.getItem('user')).token : null;; // Assuming the token is stored in localStorage

                const response = await fetch(`${url}/recipes`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setRecipes(data);
                } else {
                    // Handle error response
                    console.error('Error fetching data:', response.status);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchMyRecipes();
    }, []);
    const openModal = () => {
        setOpen(true);
    };
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    const openRecipeModal = async (recipe) => {
        try {
            // Fetch recipe collections
            const recipeCollectionsResponse = await fetch(url+`/users/${userId}/collections`,{
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,

                }
            });
            const recipeCollectionsData = await recipeCollectionsResponse.json();
            setRecipeCollections(recipeCollectionsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setSelectedRecipe(recipe);
    };

    const closeRecipeModal = () => {
        setSelectedRecipe(null);
    };
    // Function to handle opening the recipe modal
    const handleOpenRecipeModal = (recipe) => {
        setSelectedRecipe(recipe);
    };

    // Function to handle closing the recipe modal
    const handleCloseRecipeModal = () => {
        setSelectedRecipe(null);
    };
    const closeModal = () => {
        setOpen(false);
        setNewRecipe({
            name: '',
            description: '',
            cooking_time: '',
            difficulty: '',
            serving_size: '',
            calories: '',
            fat: '',
            carbohydrates: '',
            protein: '',
            image:''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRecipe((prevRecipe) => ({
            ...prevRecipe,
            [name]: value,
        }));
    };
    const token = localStorage.getItem('user')? JSON.parse(localStorage.getItem('user')).token : null;

    const handleCreateRecipe = () => {
        const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null;
        const formData = new FormData();
        formData.append('name', newRecipe.name);
        formData.append('description', newRecipe.description);
        formData.append('cooking_time', newRecipe.cooking_time);
        formData.append('difficulty', newRecipe.difficulty);
        formData.append('serving_size', newRecipe.serving_size);
        formData.append('calories', newRecipe.calories);
        formData.append('fat', newRecipe.fat);
        formData.append('carbohydrates', newRecipe.carbohydrates);
        formData.append('protein', newRecipe.protein);
        formData.append('image', picture.pictureAsFile);

        fetch(url+'/recipes', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`,

            }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Recipe created successfully:', data);
                closeModal();
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error creating recipe:', error);
            });
    };
    const addRecipeToCollection = (selectedRecipe, selectedCollection) => {
        // Extract the user ID, collection ID, and recipe ID
        const collectionId = selectedCollection.id;
        const recipeId = selectedRecipe.id;

        // Make a POST request to the server
        fetch(url+`/${userId}/collections/${collectionId}/recipes/${recipeId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(selectedRecipe)
        })
            .then(response => {
                if (response.ok) {
                    // Recipe added successfully
                    console.log('Recipe added to the collection.');
                    // Perform any necessary UI updates or actions
                } else {
                    // Error occurred while adding the recipe
                    console.error('Failed to add the recipe to the collection.');
                    // Perform error handling or display error messages
                }
            })
            .catch(error => {
                console.error('An error occurred:', error);
                // Perform error handling or display error messages
            });
    };



    return (
        <div>
            <h2>Featured Recipes</h2>
            <div className="search-bar">
                <input type="text" placeholder="Search for recipes" onChange={handleSearch} />
                <button>Search</button>
            </div>
            <RecipeGrid>
                {recipes.map((recipe) => (
                    <div key={recipe.id} style={{ margin: '10px' }}>
                    <RecipeCard key={recipe.id} >
                        <img
                            src={`${url}/images/${recipe.imageUrls[0]}`}
                            alt={recipe.name}
                            onClick={() => openRecipeModal(recipe)}
                            style={{ width: '489.6px', height: '326.4px' }}
                        />
                        <h3>{recipe.name}</h3>
                    </RecipeCard>
                    </div>
                ))}
            </RecipeGrid>

            <Button variant="contained" color="primary" onClick={openModal}>
                Add Recipe
            </Button>
            <Modal open={open} onClose={closeModal} className="bg">
                <ModalContent className="modalcontainer">
                    <TextField className="textfield-style"
                        label="Name"
                        name="name"
                        value={newRecipe.name}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField style={{margin:'5px'}}
                        label="Description"
                        name="description"
                        value={newRecipe.description}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField style={{margin:'5px'}}
                        label="Cooking Time"
                        name="cooking_time"
                        value={newRecipe.cooking_time}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField style={{margin:'5px'}}
                        label="Difficulty"
                        name="difficulty"
                        value={newRecipe.difficulty}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField style={{margin:'5px'}}
                        label="Serving Size"
                        name="serving_size"
                        value={newRecipe.serving_size}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField style={{margin:'5px'}}
                        label="Calories"
                        name="calories"
                        value={newRecipe.calories}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField style={{margin:'5px'}}
                        label="Fat"
                        name="fat"
                        value={newRecipe.fat}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField style={{margin:'5px'}}
                        label="Carbohydrates"
                        name="carbohydrates"
                        value={newRecipe.carbohydrates}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField style={{margin:'5px'}}
                        label="Protein"
                        name="protein"
                        value={newRecipe.protein}
                        onChange={handleInputChange}
                        fullWidth
                    />

                    <input style={{margin:'5px'}}
                           accept="image/*"
                            type="file"
                            name="image"
                           onChange={uploadPicture}
                    />

                    {/* Add any other fields from the Recipe model */}
                    <Button style={{margin:'5px'}} variant="contained" color="primary" onClick={handleCreateRecipe}>
                        Create Recipe
                    </Button>
                </ModalContent>
            </Modal>
            <RecipeModal
                selectedRecipe={selectedRecipe}
                closeRecipeModal={closeRecipeModal}
                recipeCollections={recipeCollections}
                addRecipeToCollection={addRecipeToCollection}
            />
        </div>
    );
};

export default HomePage;