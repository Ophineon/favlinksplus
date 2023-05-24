import axios from 'axios';
const [links, setLinks] = useState([]);
useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await axios.get('/links');
        setLinks(response.data);
      } catch (error) {
        console.error('Error fetching links:', error);
      }
    };
  
    fetchLinks();
  }, []);
  return (
    <div>
      {links.map((link) => (
        <div key={link.id}>
          <h3>{link.title}</h3>
          <p>{link.url}</p>
        </div>
      ))}
    </div>
  );
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const title = event.target.title.value;
    const url = event.target.url.value;
  
    try {
      const response = await axios.post('/links', { title, url });
      const newLink = response.data;
      setLinks((prevLinks) => [...prevLinks, newLink]);
    } catch (error) {
      console.error('Error adding link:', error);
    }
  
    event.target.reset();
  };
  
  return (
    <div>
      {/* Form for adding a new link */}
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" />
        <input type="text" name="url" placeholder="URL" />
        <button type="submit">Add Link</button>
      </form>
  
      {/* Display the links */}
      {links.map((link) => (
        <div key={link.id}>
          <h3>{link.title}</h3>
          <p>{link.url}</p>
        </div>
      ))}
    </div>
  ); 
  
  
  