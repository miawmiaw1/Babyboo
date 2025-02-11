import React, { useEffect, useState } from 'react';
import { FetchAllCateGories } from '../../../FrontendRequests/Requests-Api/Category';
import type { Category } from '../../../FrontendRequests/Requests-Api/Category';

export default function Categories() {
  const [GetCategories, SetCategories] = useState<Category[] | null>(null);

  const GetCategory = async () => {
    try {
      const result = await FetchAllCateGories();
      if (result.result) {
        const categoryarray : Category[] = result.data.sort(() => Math.random() - 0.5)
        SetCategories(categoryarray);
      }
    } catch (error) {
      console.error('Error Getting Category:', error);
    }
  };

  useEffect(() => {
    GetCategory();
  }, []);

  const classBody = 'text-center w-100 pt-8';

  return (
    <div className="row mb-5 mt-5">
      {GetCategories !== null &&
        GetCategories.map((category, index) => (
          <div className="col-md-6 col-lg-3 mb-5" key={index}>
              <a href={`/?categoryid=${category.categoryid}`}>
                <div className="card card-background align-items-start mb-4 mb-lg-0">
                  <div
                    className="full-background"
                    style={{
                      backgroundImage: `url(${category.categoryimage})`,
                      backgroundSize: 'cover',
                    }}
                  ></div>
                  <div className={`card-body ${classBody}`}>
                    <div className="d-block mt-10">
                      <p className="text-white font-weight-bold mb-1">{category.categoryname}</p>
                      <h4 className="text-white font-weight-bolder">{category.categoryname}</h4>
                      <a href={`/?categoryid=${category.categoryid}`} className="text-white text-sm font-weight-semibold mb-0">
                      Flere produkter &#62;
                      </a>
                    </div>
                  </div>
                </div>
              </a>
          </div>
        ))}
    </div>
  );
}