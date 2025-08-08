// Mock API service for testing without a backend

// Mock data
const mockUsers = [
  { id: 1, username: 'demo', email: 'demo@example.com', name: 'Demo User' }
];

const mockRecipes = [
  {
    id: 1,
    title: 'Spaghetti Carbonara',
    description: 'A classic Italian pasta dish made with eggs, cheese, pancetta, and pepper.',
    prep_time: 15,
    cook_time: 20,
    servings: 4,
    difficulty: 'Medium',
    author: { id: 1, name: 'Chef John' },
    rating: 4.5,
    likes_count: 24,
    ingredients: [
      '400g spaghetti',
      '150g pancetta or guanciale, diced',
      '4 large eggs',
      '100g Pecorino Romano cheese, grated',
      '50g Parmesan cheese, grated',
      'Black pepper, to taste',
      'Salt, to taste'
    ],
    instructions: [
      'Bring a large pot of salted water to boil. Add spaghetti and cook according to package instructions until al dente.',
      'While the pasta is cooking, heat a large skillet over medium heat. Add pancetta and cook until crispy, about 5-7 minutes.',
      'In a bowl, whisk together eggs, Pecorino Romano, Parmesan, and a generous amount of black pepper.',
      'Once the pasta is cooked, reserve 1 cup of pasta water and drain the rest.',
      'Add the hot pasta to the skillet with pancetta. Remove from heat and quickly stir in the egg mixture, adding pasta water as needed to create a creamy sauce.',
      'Serve immediately with additional cheese and black pepper on top.'
    ]
  },
  {
    id: 2,
    title: 'Chocolate Chip Cookies',
    description: 'Classic chocolate chip cookies that are soft and chewy in the center with crispy edges.',
    prep_time: 20,
    cook_time: 12,
    servings: 24,
    difficulty: 'Easy',
    author: { id: 1, name: 'Chef Maria' },
    rating: 5.0,
    likes_count: 42,
    ingredients: [
      '2 1/4 cups all-purpose flour',
      '1 tsp baking soda',
      '1 tsp salt',
      '1 cup butter, softened',
      '3/4 cup granulated sugar',
      '3/4 cup packed brown sugar',
      '2 large eggs',
      '2 tsp vanilla extract',
      '2 cups chocolate chips'
    ],
    instructions: [
      'Preheat oven to 375°F (190°C).',
      'In a small bowl, combine flour, baking soda, and salt. Set aside.',
      'In a large bowl, beat butter, granulated sugar, and brown sugar until creamy.',
      'Add eggs and vanilla extract, beat well.',
      'Gradually blend in the flour mixture.',
      'Stir in chocolate chips.',
      'Drop rounded tablespoons of dough onto ungreased cookie sheets.',
      'Bake for 9 to 11 minutes or until golden brown.',
      'Cool on cookie sheet for 2 minutes; remove to wire rack to cool completely.'
    ]
  },
  {
    id: 3,
    title: 'Vegetable Stir Fry',
    description: 'A healthy and colorful vegetable stir fry with tofu, perfect for a quick weeknight meal.',
    prep_time: 15,
    cook_time: 10,
    servings: 2,
    difficulty: 'Easy',
    author: { id: 1, name: 'Chef David' },
    rating: 4.2,
    likes_count: 18,
    ingredients: [
      '1 block extra-firm tofu, pressed and cubed',
      '2 tbsp soy sauce',
      '1 tbsp cornstarch',
      '2 tbsp vegetable oil',
      '1 bell pepper, sliced',
      '1 carrot, julienned',
      '1 cup broccoli florets',
      '1/2 cup snap peas',
      '2 cloves garlic, minced',
      '1 tbsp ginger, minced',
      '2 tbsp soy sauce',
      '1 tbsp honey',
      '1 tsp sesame oil',
      'Sesame seeds for garnish'
    ],
    instructions: [
      'Press tofu to remove excess water, then cut into cubes.',
      'In a bowl, combine tofu with 2 tbsp soy sauce and cornstarch. Let marinate for 10 minutes.',
      'Heat 1 tbsp oil in a large skillet or wok over medium-high heat.',
      'Add tofu and cook until golden on all sides, about 5 minutes. Remove and set aside.',
      'Add remaining oil to the skillet. Add bell pepper, carrot, broccoli, and snap peas.',
      'Stir fry for 3-4 minutes until vegetables are crisp-tender.',
      'Add garlic and ginger, cook for 30 seconds.',
      'In a small bowl, whisk together 2 tbsp soy sauce, honey, and sesame oil.',
      'Add the sauce to the skillet and stir to combine.',
      'Return tofu to the skillet and toss to coat with sauce.',
      'Cook for 1-2 minutes until everything is heated through.',
      'Garnish with sesame seeds and serve hot.'
    ]
  }
];

const mockComments = [
  {
    id: 1,
    author: 'FoodLover123',
    content: 'This recipe is amazing! I added some mushrooms and it turned out great.',
    timestamp: '2023-05-15T10:30:00Z',
    rating: 5,
    recipe: 1
  },
  {
    id: 2,
    author: 'CookingEnthusiast',
    content: 'The sauce was a bit too thick for my taste, but overall a good recipe.',
    timestamp: '2023-05-10T14:22:00Z',
    rating: 4,
    recipe: 1
  }
];

// Mock API functions
export const getRecipes = async (page = 1, pageSize = 12) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedRecipes = mockRecipes.slice(start, end);
  
  return {
    results: paginatedRecipes,
    count: mockRecipes.length,
    next: page * pageSize < mockRecipes.length ? `/?page=${page + 1}` : null,
    previous: page > 1 ? `/?page=${page - 1}` : null
  };
};

export const getRecipe = async (id) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const recipe = mockRecipes.find(r => r.id === parseInt(id));
  if (!recipe) {
    throw new Error('Recipe not found');
  }
  return recipe;
};

export const createRecipe = async (recipeData) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newRecipe = {
    id: mockRecipes.length + 1,
    ...recipeData,
    author: { id: 1, name: 'Demo User' },
    rating: 0,
    likes_count: 0
  };
  
  mockRecipes.push(newRecipe);
  return newRecipe;
};

export const updateRecipe = async (id, recipeData) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockRecipes.findIndex(r => r.id === parseInt(id));
  if (index === -1) {
    throw new Error('Recipe not found');
  }
  
  mockRecipes[index] = {
    ...mockRecipes[index],
    ...recipeData
  };
  
  return mockRecipes[index];
};

export const deleteRecipe = async (id) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockRecipes.findIndex(r => r.id === parseInt(id));
  if (index === -1) {
    throw new Error('Recipe not found');
  }
  
  mockRecipes.splice(index, 1);
  return null;
};

export const searchRecipes = async (query, page = 1, pageSize = 12) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const filteredRecipes = mockRecipes.filter(recipe => 
    recipe.title.toLowerCase().includes(query.toLowerCase()) ||
    recipe.description.toLowerCase().includes(query.toLowerCase()) ||
    recipe.ingredients.some(ingredient => 
      ingredient.toLowerCase().includes(query.toLowerCase())
    )
  );
  
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedRecipes = filteredRecipes.slice(start, end);
  
  return {
    results: paginatedRecipes,
    count: filteredRecipes.length,
    next: page * pageSize < filteredRecipes.length ? `/?page=${page + 1}` : null,
    previous: page > 1 ? `/?page=${page - 1}` : null
  };
};

export const getRecipesByAuthor = async (authorId, page = 1, pageSize = 12) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const filteredRecipes = mockRecipes.filter(recipe => recipe.author.id === authorId);
  
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedRecipes = filteredRecipes.slice(start, end);
  
  return {
    results: paginatedRecipes,
    count: filteredRecipes.length,
    next: page * pageSize < filteredRecipes.length ? `/?page=${page + 1}` : null,
    previous: page > 1 ? `/?page=${page - 1}` : null
  };
};

export const rateRecipe = async (recipeId, rating) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Try to find the recipe, but don't fail if not found (might be from real backend)
  const recipe = mockRecipes.find(r => r.id === parseInt(recipeId));
  if (recipe) {
    recipe.rating = rating;
  }
  
  return { message: 'Rating submitted successfully' };
};

export const likeRecipe = async (recipeId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Try to find the recipe, but don't fail if not found (might be from real backend)
  const recipe = mockRecipes.find(r => r.id === parseInt(recipeId));
  if (recipe) {
    recipe.likes_count += 1;
  }
  
  return { message: 'Recipe liked successfully' };
};

export const unlikeRecipe = async (recipeId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Try to find the recipe, but don't fail if not found (might be from real backend)
  const recipe = mockRecipes.find(r => r.id === parseInt(recipeId));
  if (recipe) {
    recipe.likes_count = Math.max(0, recipe.likes_count - 1);
  }
  
  return { message: 'Recipe unliked successfully' };
};

export const addComment = async (recipeId, comment) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Don't validate recipe existence since it might come from real backend
  // Just allow commenting on any recipeId
  const newComment = {
    id: mockComments.length + 1,
    author: 'Demo User',
    content: comment,
    timestamp: new Date().toISOString(),
    rating: 0,
    recipe: parseInt(recipeId)
  };
  
  mockComments.push(newComment);
  return newComment;
};

export const getComments = async (recipeId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockComments.filter(comment => comment.recipe === parseInt(recipeId));
};


export const editComment = async (recipeId, commentId, content) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockComments.findIndex(comment =>
    comment.id === parseInt(commentId) && comment.recipe === parseInt(recipeId)
  );
  
  if (index === -1) {
    throw new Error('Comment not found');
  }
  
  mockComments[index].content = content;
  mockComments[index].updated_at = new Date().toISOString();
  
  return mockComments[index];
};

export const hideComment = async (recipeId, commentId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockComments.findIndex(comment =>
    comment.id === parseInt(commentId) && comment.recipe === parseInt(recipeId)
  );
  
  if (index === -1) {
    throw new Error('Comment not found');
  }
  
  mockComments[index].hidden = true;
  
  return { message: 'Comment hidden successfully' };
};

export const deleteComment = async (recipeId, commentId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockComments.findIndex(comment =>
    comment.id === parseInt(commentId) && comment.recipe === parseInt(recipeId)
  );
  
  if (index === -1) {
    throw new Error('Comment not found');
  }
  
  mockComments.splice(index, 1);
  return null;
};

export const register = async (userData) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check if user already exists
  const existingUser = mockUsers.find(user => user.email === userData.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  
  const newUser = {
    id: mockUsers.length + 1,
    ...userData
  };
  
  mockUsers.push(newUser);
  
  // Generate a mock token
  const token = btoa(JSON.stringify(newUser)); // Simple base64 encoding for demo
  
  return {
    user: newUser,
    token: token
  };
};

export const login = async (credentials) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Find user by email
  const user = mockUsers.find(user => user.email === credentials.email);
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // In a real app, we would verify the password here
  // For demo purposes, we'll just check if the user exists
  
  // Generate a mock token
  const token = btoa(JSON.stringify(user)); // Simple base64 encoding for demo
  
  return {
    user: user,
    token: token
  };
};

export const logout = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real app, we would invalidate the token on the server
  // For demo purposes, we just return a success message
  return { message: 'Logged out successfully' };
};