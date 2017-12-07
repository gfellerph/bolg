export default (database) => {
  const ref = uid => database.ref(`/subscribers/${uid}`);

  /**
   * Save a tipp to firebase
   * @returns {Promise} Firebase promise
   */
  const set = subscriber => ref(subscriber.uid).set(subscriber.normalize());

  /**
   * Remove the tipp from firebase
   * @returns {Promise} Firebase promise
   */
  const remove = subscriber => ref(subscriber.uid).remove();

  return {
    set,
    remove,
  }
}
