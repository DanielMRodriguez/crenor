import { marked } from "marked";
import { useState } from "react";

const Faq = ({ faq_list }) => {
  const [isActive, setIsActive] = useState([]);
  const accordionHandler = (index) => {
    if (isActive.includes(index)) {
      setIsActive(isActive.filter((item) => item !== index));
    } else {
      setIsActive((prev) => [...prev, index]);
    }
  };

  return (
    <div className="">
      {faq_list.map((item, i) => (
        <div
          className={`accordion ${isActive.includes(i) ? "active" : undefined
            }`}
          onClick={() => accordionHandler(i)}
          key={`item-${i}`}
        >
          <div
            className="accordion-header relative pl-6 font-semibold "

          >
            {item.title}
           
           
          </div>
          <div className="accordion-content pl-6">
            <p
              dangerouslySetInnerHTML={{
                __html: marked.parseInline(item.content),
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Faq;
