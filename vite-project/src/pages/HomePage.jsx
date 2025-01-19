const HomePage = () => {
  return (
    <div className="homepage-container">
      {/* Flex container for the two main sections */}
      <div className="flex-container">
        {/* Safety Section */}
        <div className="safety-section">
          <h1 className="safety-header">Safety made easy</h1>
          <p className="safety-description">
            This is a short description of the product and/or a phrase that makes people want to click!
          </p>
          <button className="get-started-button">Get started</button>
        </div>

        {/* Trojo Section */}
        <div className="trojo-section">
          <h1 className="trojo-header">
            Tro<span className="long-j">j</span>o
          </h1>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
