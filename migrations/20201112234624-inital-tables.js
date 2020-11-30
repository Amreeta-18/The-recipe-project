'use strict'

var dbm
var type
var seed

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate
  type = dbm.dataType
  seed = seedLink
}

exports.up = function(db, callback) {
  console.log('Building tables...')
  
  db.createTable('users', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: 'string',
      notNull: true,
      unique: true,
    },
    password: {
      type: 'string',
      notNull: true,
    },
    first_name: 'string',
    last_name: 'string',
    created_at: {
      type: 'timestamp',
      notNull: true,
    },
    modified_at: 'timestamp',
  }, callback)
  console.log('users table built successfully')

  db.createTable('ingredients', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: 'string',
      notNull: true,
    },
    aisle: 'string',
    consistency: 'string',
    unit: 'string',
    // score:
    // Main_protein = 4
    // Main_greens = 3
    // Condiments = 2
    // Staples = 1
    score: 'int',
    created_at: {
      type: 'timestamp',
      notNull: true,
    },
    modified_at: 'timestamp',
  }, callback)
  console.log('ingredients table built successfully')

  db.createTable('recipes', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: 'string',
      notNull: true,
    },
    // misc
    servings: 'int',
    ready_in_minutes: 'int',
    source_name: 'string',
    source_url: 'string',
    imgurl: 'string',
    instructions: 'text',
    health_score: 'int',
    spoonacular_score: 'int',
    // pricePerServing originally is a float, needs to be turned into int before save
    price_per_serving: 'int',
    // calories originally is a float, needs to be turned into int before save
    nutrition: 'text',
    // category
    cheap: 'boolean',
    dairy_free: 'boolean',
    gluten_free: 'boolean',
    ketogenic: 'boolean',
    low_fodmap: 'boolean',
    sustainable: 'boolean',
    vegan: 'boolean',
    vegetarian: 'boolean',
    very_healthy: 'boolean',
    whole30: 'boolean',
    created_at: {
      type: 'timestamp',
      notNull: true,
    },
    modified_at: 'timestamp',
  }, callback)
  console.log('recipes table built successfully')

  db.createTable('recipe_ingredients', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
    },
    recipe_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'recipe_id',
        table: 'recipes',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    ingredient_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'ingredient_id',
        table: 'ingredients',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
    amount: 'int',
    original_desc: 'string',
    created_at: {
      type: 'date',
      notNull: true,
    },
    modified_at: 'timestamp',
  }, callback)
  console.log('recipe_ingredients table built successfully')
}

exports.down = function(db, callback) {
  db.dropTable('recipe_ingredients', callback)
  db.dropTable('ingredients', callback)
  db.dropTable('recipes', callback)
  db.dropTable('users', callback)
}

exports._meta = {
  "version": 1
}
