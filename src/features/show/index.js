
const FeatureShow = () => {

  const item = {
    name: "Feature Name",
    description: "Yhis a sample item with some details",
    details: [
      "Detail 1: This is the first detail",
      "Detail 2: This is the second detail",
      "Detail 3: This is the third detail."
    ]
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.name}>{item.name}</h1>
      <p style={styles.description}>{item.description}</p>
      <ul style={styles.detailslist}>
        {item.details.map((detail, index) => (
          <li key={index} style={styles.detailItem}>
            {detail}
          </li>
        ))}
      </ul>
    </div>
  )
}

const styles = {
  container: {
    maxWith: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, snas-serif'
  },
  name: {
    fontSize: '24px',
    fontWeigth: 'bold',
    marginBottom: '10px'
  },
  description: {
    fontSize: '16px',
    color: '#555',
    marginBottom: '20px'
  },
  detailsList: {
    listStyleType: 'disc',
    paddingLeft: '20px'
  },
  detailItem: {
    fontSize: '14px',
    marginBottom: '10px',
  }
}

export default FeatureShow