
## Modified Data Restructure:

The application stores all the locally generated data under property name 'modifiedData'. This object has a particular structure which can change during the course of development. However, when a restructure is done and new version is shipped the older version coming to the newer one having stored data in old format may cause issues. That's why a `structureVersion` property is maintained in the `modifiedData` object which is collected from `utils/config.js` file.

Whenever a new data structure is adopted the `structureVersion` property in the config must be incremented before making a new build. And when the application starts it tries to find out if structure version is updated.

Right now the application faced two changes in structure version. For example `_5-to-6` and `_6-to-7`. Let's say a really old version of the app is trying to upgrade to the latest version and more then one structure version has changed. Now the app will try to find all the steps it needs to follow to upgrade to the latest version.

```
function findCaseNames (from, to) {
  let caseNames = []
  for (let i = from; i < to; i++) {
    let val = i
    caseNames.push(`_${val}-to-${++val}`)
  }
  return caseNames
}
```

The above function will find all the case names and call each functions based on the `caseNames` list and change the structure version of the data progressively.

```
caseNames.forEach(caseName => {
  restructuredData = restructure(restructuredData, allTrips, caseName)
})

...

function restructure (modifiedData, allTrips, caseName) {
  switch (caseName) {
    case '_5-to-6':
      return _5To6(modifiedData, allTrips)
    case '_6-to-7':
      return _6to7(modifiedData, allTrips)
    default:
      return modifiedData
  }
}
```

In this way whenever a new structure version is needed we only need to write a method which can change the data structure from the immediate previous structure and a version which has missed more then one structure change update in between will sort everything out automatically.