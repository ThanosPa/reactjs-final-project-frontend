import React, { useState } from 'react';
import Rating from '@material-ui/lab/Rating';

import { makeStyles } from '@material-ui/core/styles';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    modalContent: {
        padding: theme.spacing(2),
    },
    closeButton: {
        marginLeft: 'auto',
        marginRight: theme.spacing(2),
    },
}));

const RecipeModal = ({ selectedRecipe, closeRecipeModal, recipeCollections, addRecipeToCollection}) => {
    const classes = useStyles();
    const [rating, setRating] = useState(0);
    const [comments, setComments] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState('');

    if (!selectedRecipe) {
        return null;
    }


    const handleRatingChange = (event, value) => {
        setRating(value);
    };

    const handleCommentSubmit = (event) => {
        event.preventDefault();
        // Add logic to save comment to the database or state
        const newComment = event.target.comment.value;
        setComments((prevComments) => [...prevComments, newComment]);
        event.target.reset();
    };
    const handleCollectionChange = (event) => {
        setSelectedCollection(event.target.value);
    };

    const handleAddToCollection = () => {
        addRecipeToCollection(selectedRecipe, selectedCollection);
        closeRecipeModal();
    };
    return (
        <Dialog open={true} onClose={closeRecipeModal}>
            <DialogTitle>{selectedRecipe.name}</DialogTitle>
            <DialogContent>
                <Typography>{selectedRecipe.description}</Typography>
                <Typography>Cooking Time: {selectedRecipe.cooking_time}</Typography>
                <Typography>Difficulty: {selectedRecipe.difficulty}</Typography>
                <Typography>Serving Size: {selectedRecipe.serving_size}</Typography>
                <Typography>Calories: {selectedRecipe.calories}</Typography>
                <Typography>Fat: {selectedRecipe.fat}</Typography>
                <Typography>Carbohydrates: {selectedRecipe.carbohydrates}</Typography>
                <Typography>Protein: {selectedRecipe.protein}</Typography>
                <Rating value={rating} onChange={(event, newValue) => setRating(newValue)} />
                {recipeCollections.length > 0 ? (
                    <FormControl className={classes.formControl}>
                        <InputLabel id="collection-select-label">Recipe Collection</InputLabel>
                        <Select
                            labelId="collection-select-label"
                            id="collection-select"
                            value={selectedCollection}
                            onChange={handleCollectionChange}
                        >
                            {recipeCollections.map((collection) => (
                                <MenuItem key={collection.id} value={collection.id}>
                                    {collection.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ) : (
                    <Typography>No recipe collections available.</Typography>
                )}
                <div>
                    <Typography variant="h6">Comments:</Typography>
                    {/* Display comments here */}
                    {comments.map((comment, index) => (
                        <Typography key={index}>{comment}</Typography>
                    ))}
                </div>
                <form onSubmit={handleCommentSubmit}>
                    <input type="text" name="comment" placeholder="Add a comment" />
                    <Button type="submit" color="primary">
                        Submit
                    </Button>
                </form>
                <Button onClick={handleAddToCollection}>Add to Collection</Button>
                <Button onClick={closeRecipeModal}>Close</Button>
            </DialogContent>
        </Dialog>
    );
};

export default RecipeModal;
