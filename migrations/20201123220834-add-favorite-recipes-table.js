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
  
  db.createTable('favorite_recipes', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'user_id',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
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
    created_at: {
      type: 'timestamp',
      notNull: true,
    },
  }, callback)
  console.log('favorite_recipes table built successfully')
}

exports.down = function(db, callback) {
  db.dropTable('favorite_recipes', callback)
}

exports._meta = {
  "version": 1
}































