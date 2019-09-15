const { expect } = require('chai');
const buildBusfactors = require('../lib/build-busfactors');

describe('build-busfactory', () => {
  it('should build bus factors from commits', () => {
    const commits = [
      {
        author: { email: 'a@nomail.please' },
        stat: [{ filepath: 'a.js', added: 2, deleted: 0 }],
      },
      {
        author: { email: 'a@nomail.please' },
        stat: [{ filepath: 'a.js', added: 2, deleted: 0 }],
      },
    ];

    const busfactors = buildBusfactors(commits);

    expect(busfactors).to.have.length(1);
    expect(busfactors[0]).to.deep.equal({ filepath: 'a.js', authors: ['a@nomail.please'], commits: 2, busfactor: 1 });
  });

  it('should build bus factors for multiple files and authors in commits', () => {
    const commits = [
      {
        author: { email: 'a@nomail.please' },
        stat: [{ filepath: 'a.js', added: 2, deleted: 0 }, { filepath: 'b.js', added: 2, deleted: 0 }],
      },
      {
        author: { email: 'a@nomail.please' },
        stat: [{ filepath: 'a.js', added: 2, deleted: 0 }],
      },
      {
        author: { email: 'b@nomail.please' },
        stat: [{ filepath: 'b.js', added: 2, deleted: 0 }],
      },
    ];

    const busfactors = buildBusfactors(commits);

    expect(busfactors).to.have.length(2);
    expect(busfactors[0]).to.deep.equal({ filepath: 'b.js', authors: ['a@nomail.please', 'b@nomail.please'], commits: 2, busfactor: 2 });
    expect(busfactors[1]).to.deep.equal({ filepath: 'a.js', authors: ['a@nomail.please'], commits: 2, busfactor: 1 });
  });
});
