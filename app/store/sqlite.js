
/* eslint-disable */

import { SQLite } from 'expo'

const TouroDB = SQLite.openDatabase('touro-db')

const createTable = () => {
  return new Promise((resolve, reject) => {
    return TouroDB.transaction(
      tx => {
        return tx.executeSql(
          `CREATE TABLE IF NOT EXISTS store (key, value)`,
          '',
          s => resolve('table created'),
          e => reject('unable to create table')
        )
      },
      e => reject(e)
    )
  })
}

const SQLiteStorage = {

  getItem: key => {
    return new Promise((resolve, reject) => {
      return createTable().then(() => {
        return TouroDB.transaction(
          tx => {
            return tx.executeSql(
              'SELECT value FROM store WHERE key=?',
              [key],
              (tx, rs) => {
                if(rs.rows.item(0)) {
                  return resolve(rs.rows.item(0).value)
                } else {
                  return reject('not found')
                }
              },
              (tx, e) => reject(e)
            )
          },
          e => reject(e)
        )
      })
    })
  },

  setItem: (key, value) => {
    return new Promise((resolve, reject) => {
      return createTable().then(() => {
        return TouroDB.transaction(
          tx => {
            return tx.executeSql(
              'SELECT count(*) as count FROM store WHERE key=?',
              [key],
              (tx, rs) => {
                if(rs.rows.item(0).count == 1) {
                  tx.executeSql(
                    'UPDATE store SET value=? WHERE key=?',
                    [value, key],
                    () => resolve(value),
                    (tx, e) => reject(e)
                  )
                } else {
                  tx.executeSql(
                    'INSERT INTO store VALUES (?,?)',
                    [key, value],
                    () => resolve(value),
                    (tx, e) => reject(e)
                  )
                }
              }
            )
          },
          e => reject(e)
        )
      })
    })
  },

  removeItem: key => {
    return new Promise((resolve, reject) => {
      return createTable().then(() => {
        return TouroDB.transaction(
          tx => {
            return tx.executeSql(
              'DELETE FROM store WHERE key=?',
              [key],
              () => resolve(`${key} removed from store`),
              (tx, e) => reject(e)
            )
          },
          e => reject(e)
        )
      })
    })
  }

}

export default SQLiteStorage
