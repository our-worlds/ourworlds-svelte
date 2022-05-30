Moralis.Cloud.define('sortedCategories', async () => {
  const query = new Moralis.Query('Categories');
  const pipeline = [{ sort: { sortorder: 1 } }, { project: { title: 1, value: 1 } }];

  return await query.aggregate(pipeline);
});

Moralis.Cloud.define('getDeedParticipants', async (request) => {
  const deedQuery = new Moralis.Query('Deed');
  deedQuery.equalTo('objectId', request.params.deedObjectId);
  const deed = await deedQuery.first({ useMasterKey: true });
  const relation = deed.relation('participants');
  const results = await relation.query().find({ useMasterKey: true });

  return results;
});

Moralis.Cloud.define('resetIsRequestingCompletion', async (request) => {
  const participantQuery = new Moralis.Query('User');
  participantQuery.equalTo('objectId', request.params.participantObjectId);
  const participant = await participantQuery.first({ useMasterKey: true });
  participant.isRequestingCompletion = false;
  partcipant.save();
});
