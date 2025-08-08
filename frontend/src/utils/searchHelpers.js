// Popular search terms and suggestions for enhanced search experience
export const popularSearchTerms = [
  // Meal types
  'breakfast', 'lunch', 'dinner', 'dessert', 'snack',
  // Cooking methods
  'baked', 'grilled', 'fried', 'roasted', 'steamed',
  // Cuisines
  'italian', 'chinese', 'mexican', 'indian', 'thai',
  // Dietary
  'vegetarian', 'vegan', 'gluten-free', 'keto', 'healthy',
  // Popular ingredients
  'chicken', 'pasta', 'rice', 'chocolate', 'cheese',
  // Time-based
  'quick', 'easy', '30 minutes', 'one pot'
];

export const searchSuggestions = {
  // When user types these, suggest related terms
  'chick': ['chicken breast', 'chicken thighs', 'chicken curry', 'chicken soup'],
  'past': ['pasta salad', 'pasta bake', 'spaghetti', 'lasagna'],
  'veget': ['vegetarian curry', 'vegetable stir fry', 'veggie burgers'],
  'choc': ['chocolate cake', 'chocolate chip cookies', 'hot chocolate'],
  'quick': ['quick breakfast', 'quick lunch', 'quick dinner', '15 minute meals'],
  'heal': ['healthy breakfast', 'healthy snacks', 'low calorie', 'nutritious'],
  'ital': ['italian pasta', 'pizza', 'risotto', 'italian desserts'],
  'spic': ['spicy curry', 'hot sauce', 'jalapeño', 'cayenne pepper']
};

// Function to get search suggestions based on partial input
export const getSearchSuggestions = (input) => {
  if (!input || input.length < 3) return [];
  
  const lowerInput = input.toLowerCase();
  const suggestions = [];
  
  // Check if input matches any suggestion keys
  Object.keys(searchSuggestions).forEach(key => {
    if (lowerInput.includes(key)) {
      suggestions.push(...searchSuggestions[key]);
    }
  });
  
  // Add popular terms that contain the input
  popularSearchTerms.forEach(term => {
    if (term.toLowerCase().includes(lowerInput) && !suggestions.includes(term)) {
      suggestions.push(term);
    }
  });
  
  return suggestions.slice(0, 5); // Return max 5 suggestions
};

// Function to highlight search terms in results
export const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm || !text) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
};

// Function to extract relevant keywords from a recipe for search indexing
export const extractSearchKeywords = (recipe) => {
  const keywords = [];
  
  if (recipe.title) {
    keywords.push(...recipe.title.toLowerCase().split(' '));
  }
  
  if (recipe.description) {
    keywords.push(...recipe.description.toLowerCase().split(' '));
  }
  
  if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
    recipe.ingredients.forEach(ingredient => {
      if (typeof ingredient === 'string') {
        keywords.push(...ingredient.toLowerCase().split(' '));
      } else if (ingredient.name) {
        keywords.push(...ingredient.name.toLowerCase().split(' '));
      }
    });
  }
  
  if (recipe.difficulty) {
    keywords.push(recipe.difficulty.toLowerCase());
  }
  
  // Remove common words and duplicates
  const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an'];
  const uniqueKeywords = [...new Set(keywords)]
    .filter(word => word.length > 2 && !commonWords.includes(word));
  
  return uniqueKeywords;
};

// Function to calculate search relevance score
export const calculateRelevanceScore = (recipe, searchQuery) => {
  if (!searchQuery) return 0;
  
  const query = searchQuery.toLowerCase();
  const queryWords = query.split(' ').filter(word => word.length > 0);
  let score = 0;
  
  // Title matches (highest weight)
  if (recipe.title && recipe.title.toLowerCase().includes(query)) {
    score += 10;
  }
  queryWords.forEach(word => {
    if (recipe.title && recipe.title.toLowerCase().includes(word)) {
      score += 5;
    }
  });
  
  // Ingredient matches (high weight)
  if (recipe.ingredients) {
    const ingredientsText = Array.isArray(recipe.ingredients) 
      ? recipe.ingredients.join(' ').toLowerCase()
      : recipe.ingredients.toLowerCase();
    
    if (ingredientsText.includes(query)) {
      score += 7;
    }
    queryWords.forEach(word => {
      if (ingredientsText.includes(word)) {
        score += 3;
      }
    });
  }
  
  // Description matches (medium weight)
  if (recipe.description && recipe.description.toLowerCase().includes(query)) {
    score += 4;
  }
  queryWords.forEach(word => {
    if (recipe.description && recipe.description.toLowerCase().includes(word)) {
      score += 2;
    }
  });
  
  // Author matches (low weight)
  if (recipe.author) {
    const authorText = `${recipe.author.first_name || ''} ${recipe.author.last_name || ''} ${recipe.author.username || ''}`.toLowerCase();
    if (authorText.includes(query)) {
      score += 3;
    }
    queryWords.forEach(word => {
      if (authorText.includes(word)) {
        score += 1;
      }
    });
  }
  
  return score;
};
