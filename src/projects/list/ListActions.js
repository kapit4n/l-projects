export const listAction = ({setViewMode, exportProjects, sortAsc, sortDesc, syncGithub, totalProjects, totalCommits, topTen}) => {
  return (
    <div className="projects-list-totals">
      <span>Total Projects: {totalProjects}</span>
      <span>Total commits: {totalCommits}</span>
      <button onClick={exportProjects}>Export</button>
      <button onClick={sortAsc}>Asc</button>
      <button onClick={sortDesc}>Desc</button>
      <button onClick={() => setViewMode("card")}>CardView</button>
      <button onClick={() => setViewMode("hex")}>HexView</button>
      <button onClick={() => setViewMode("stats")}>Stats</button>
      <button onClick={syncGithub}>Sync</button>
      <button onClick={topTen}>Top 10</button>
    </div>
  )
}

export default listAction