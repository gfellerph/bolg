export default (database) => {
  const ref = id => database.ref(`/tipps/${id}`);

  /**
   * Save a tipp to firebase
   * @returns {Promise} Firebase promise
   */
  const set = tipp => ref(tipp.id).set(tipp.normalize());

  /**
   * Remove the tipp from firebase
   * @returns {Promise} Firebase promise
   */
  const remove = tipp => ref(tipp.id).remove();

  return {
    set,
    remove,
  }
}
