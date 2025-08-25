import React from 'react';

const CourseCard = ({ title, image, rating, reviews, price }) => (
  <div className="bg-white rounded-lg shadow-lg p-4 w-64 mx-2 transform hover:scale-105 transition-transform">
    <img src={image} alt={title} className="w-full h-48 object-cover rounded-md" />
    <div className="mt-2">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-xs text-gray-400">Various versions have evolve...</p>
      <div className="flex items-center mt-2">
        <span className="text-yellow-400">★ ★ ★ ★ ★</span>
        <span className="text-xs text-gray-500 ml-1">({reviews})</span>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-lg font-bold">${price}</span>
        <button className="bg-green-500 text-white px-2 py-1 rounded">↑</button>
      </div>
    </div>
  </div>
);

const Course = () => (
  <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
    <div className="flex items-center">
      <h1 className="text-4xl font-bold text-green-700 mr-8">Most<br />Popular<br />Course</h1>
      <div className="flex space-x-4">
        <CourseCard
          title="HTML"
          image="https://via.placeholder.com/150"
          rating={4}
          reviews={15}
          price={500}
        />
        <CourseCard
          title="Design"
          image="https://via.placeholder.com/150"
          rating={4}
          reviews={20}
          price={500}
        />
        <CourseCard
          title="Business"
          image="https://via.placeholder.com/150"
          rating={4}
          reviews={102}
          price={500}
        />
        <CourseCard
          title="Social Media"
          image="https://via.placeholder.com/150"
          rating={4.5}
          reviews={20}
          price={500}
        />
      </div>
    </div>
    <div className="flex space-x-2 ml-4">
      <button className="bg-green-500 text-white px-3 py-2 rounded">←</button>
      <button className="bg-green-500 text-white px-3 py-2 rounded">→</button>
    </div>
  </div>
);

export default Course;