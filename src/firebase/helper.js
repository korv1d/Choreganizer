import { database } from './index';

async function createGroup(name, creatorUserID) {
  const groupRef = database.ref(`usergroups/${creatorUserID}`).push();
  const gId = groupRef.key;
  return new Promise((resolve, reject) => {
    groupRef.set({
      [gId]: 'admin',
    }).then(() => {
      database.ref(`groups/${gId}`).set({
        groupName: name,
        "creatorUID": creatorUserID,
      }).then(() => {
        database.ref(`groups/${gId}/members`).set({
          creatorUserID
        },(error) => {
          if (error) {
            reject(error);
          } else {
            resolve(gId);
          }
        })
      });
    });
  });
}

async function getGroups(uid) {
  return new Promise((resolve, reject) => {
    database.ref(`usergroups/${uid}`).once('value').then((snapshot) => {
      const groups = [];
      snapshot.forEach((child, index) => {
        console.log(child.key)
        database.ref(`groups/${child.key}`).once('value').then((groupsSnapshot) => {
          groups.push({ groupName: groupsSnapshot.val().groupName, groupID: child.key });
        });
      });
      resolve(groups);
    }).catch((error) => {
      reject(error);
    });
  });
}

async function getMembers(gId) {
  return new Promise((resolve, reject) =>{
    database.ref(`groups/${gId}/members`).once('value').then((snapshot) => {
      const members = []
      snapshot
    });
  })
}

async function addChore(groupID, chore, assignedToUserName) {
  const choreRef = database.ref(`groups/${groupID}/chores`).push();
  const choreID = choreRef.key;
  return new Promise((resolve, reject) => {
    choreRef.set({
      choreName: chore,
      assignedTo: assignedToUserName,
    }).then(() => {
      database.ref(`usernames/${assignedToUserName}/uid`).once('value').then((snapshot) => {
        const assignedToUID = snapshot.val();
        choreRef.set({
          choreID,
          choreName: chore,
          assignedToUserName,
          assignedToUID,
        }, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(choreID);
          }
        });
      });
    });
  });
}

async function getChores(groupID) {
  if(groupID === ''){
    return [];
  }
  return new Promise((resolve, reject) => {
    database.ref(`groups/${groupID}/chores`).once('value').then((snapshot) => {
      const chores = [];
      if(snapshot.exists()){
        Object.values(snapshot.val()).forEach((chore) => {
          chores.push({
            choreID: chore.choreID,
            choreName: chore.choreName,
            assignedToUserName: chore.assignedToUserName,
            assignedToUID: chore.assignedToUID,
          });
        })
      }
      resolve(chores);
    }).catch((err) => {
        reject(err);
      });
  });
}

async function addUserToGroup(username, groupID) {
  return new Promise((resolve, reject) => {
    database.ref(`usernames/${username.toLowerCase()}/uid`).once('value').then((usernameSnapshot) => {
      const usernameUID = usernameSnapshot.val();
      database.ref(`groups/${groupID}/members/${usernameUID}`).set({
        usernameUID
      })
      database.ref(`usergroups/${usernameUID}/${groupID}`).set({
        [groupID]: 'admin',
      }, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(`${username} added to ${groupID}`);
        }
      });
    });
  });
}

async function deleteChore(groupID, choreID){
  return new Promise((resolve, reject) => {
    database.ref(`groups/${groupID}/chores/${choreID}`).remove((err) => {
      if(err){
        reject(err);
      }else{
        resolve(`removed chore ${choreID}`);
      }
    });

  });
}

async function deleteGroup(authID, groupID) {
  return new Promise((resolve, reject) => {
    database.ref(`usergroups/${authID}/${groupID}`).remove((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(`removed from ${groupID}`);
      }
    });
  });
}

export {
  createGroup,
  addChore,
  getChores,
  addUserToGroup,
  getGroups,
  deleteGroup,
  deleteChore
};
