// src/pages/Evaluation/DivisionSelection.js
import { useParams, useNavigate } from 'react-router-dom';

function DivisionSelection() {
  const { yearType, academicYear } = useParams();
  const navigate = useNavigate();

  const handleDivisionClick = (division) => {
    navigate(`/evaluation/${yearType}/${academicYear}/${division}`);
  };

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4">
        Division Selection for {yearType} - {academicYear}
      </h3>
      <div className="space-x-4">
        {['A', 'B', 'C'].map((div) => (
          <button
            key={div}
            onClick={() => handleDivisionClick(div)}
            className="btn"
          >
            Division {div}
          </button>
        ))}
      </div>
    </div>
  );
}

export default DivisionSelection;
