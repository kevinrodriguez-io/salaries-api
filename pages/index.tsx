import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <p>
      Api up and running. Check health at: http://localhost:3000/api/v1/health
    </p>
  );
};

export default Home;
