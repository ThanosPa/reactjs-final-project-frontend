import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import {Button, Modal, TextField} from '@mui/material';
import RecipeModal from './recipe.component';
import { Fastfood } from '@mui/icons-material';// Import the Fastfood icon component

const url = 'http://localhost:4000';

const RecipeGrid = styled('div')({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
});

const RecipeCard = styled('div')({
    textAlign: 'center',
});

const MyRecipes = () => {
    const [myRecipes, setMyRecipes] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    useEffect(() => {
        const fetchMyRecipes = async () => {
            try {
                const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null;
                const token = localStorage.getItem('user')? JSON.parse(localStorage.getItem('user')).token : null;; // Assuming the token is stored in localStorage

                const response = await fetch(`${url}/users/${userId}/recipes`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setMyRecipes(data);
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

    const [newRecipe, setNewRecipe] = useState({
        name: '',
        description: '',
        cookingTime: '',
        difficulty: '',
        servingSize: '',
        calories: '',
        fat: '',
        carbohydrates: '',
        protein: '',
    });
    const openRecipeModal = (recipe) => {
        setSelectedRecipe(recipe);
    };

    const closeRecipeModal = () => {
        setSelectedRecipe(null);
    };
    const openModal = () => {
        setOpen(true);
    };
    const ModalContent = styled('div')({
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '8px',
        outline: 'none',
    });
    const handleCreateRecipe = () => {
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
        formData.append('image', newRecipe.image);
        fetch(url+'/recipes', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Recipe created successfully:', data);
                closeModal();
            })
            .catch((error) => {
                console.error('Error creating recipe:', error);
            });
    };
    const closeModal = () => {
        setOpen(false);
        setNewRecipe({
            name: '',
            description: '',
            cookingTime: '',
            difficulty: '',
            servingSize: '',
            calories: '',
            fat: '',
            carbohydrates: '',
            protein: '',
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRecipe((prevRecipe) => ({
            ...prevRecipe,
            [name]: value,
        }));
    };
    return (
        <div>
            <h2> <Fastfood></Fastfood> My Recipes</h2>
            <Button variant="contained" color="primary" onClick={openModal}>
                Add Recipe
            </Button>
            <RecipeGrid>
                {myRecipes.map((recipe) => (
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
            <Modal open={open} onClose={closeModal} className="modalcontainer">
                <ModalContent>
                    <TextField
                        label="Name"
                        name="name"
                        value={newRecipe.name}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={newRecipe.description}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        label="Cooking Time"
                        name="cooking_time"
                        value={newRecipe.cooking_time}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        label="Difficulty"
                        name="difficulty"
                        value={newRecipe.difficulty}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        label="Serving Size"
                        name="serving_size"
                        value={newRecipe.serving_size}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        label="Calories"
                        name="calories"
                        value={newRecipe.calories}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        label="Fat"
                        name="fat"
                        value={newRecipe.fat}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        label="Carbohydrates"
                        name="carbohydrates"
                        value={newRecipe.carbohydrates}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        label="Protein"
                        name="protein"
                        value={newRecipe.protein}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <input
                        type="file"
                        name="image"
                        onChange={handleInputChange}
                    />
                    {/* Add any other fields from the Recipe model */}
                    <Button variant="contained" color="primary" onClick={handleCreateRecipe}>
                        Create Recipe
                    </Button>
                </ModalContent>
            </Modal>
            <RecipeModal
                selectedRecipe={selectedRecipe}
                closeRecipeModal={closeRecipeModal}
            />
        </div>
    );
};

export default MyRecipes;