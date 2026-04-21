import { FiCheck, FiExternalLink } from "react-icons/fi";

const RoadmapStep = ({ step, onToggle, isLast = false }) => {
  return (
    <div
      className="flex gap-4 group pb-8"
      style={{ paddingBottom: isLast ? 0 : 32 }}
    >
      {/* Timeline */}
      <div className="flex flex-col items-center">
        <button
          onClick={() => onToggle?.(step._id || step.stepNumber)}
          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 active-scale ${
            step.isCompleted
              ? "bg-gradient-to-br from-green-500 to-green-600 border-green-600 text-white shadow-md"
              : "border-slate-300 bg-white text-slate-900 hover:border-orange-400 hover:bg-orange-50"
          }`}
        >
          {step.isCompleted ? (
            <FiCheck size={16} className="font-bold" />
          ) : (
            <span className="text-sm font-bold">{step.stepNumber}</span>
          )}
        </button>
        {!isLast && (
          <div
            className={`w-1 flex-1 mt-2 min-h-[3rem] transition-all duration-500 ${step.isCompleted ? "bg-gradient-to-b from-green-500 to-slate-200" : "bg-slate-200"}`}
          />
        )}
      </div>

      {/* Step Content */}
      <div className="flex-1 pt-1">
        <div
          className={`card transition-all duration-300 ${step.isCompleted ? "opacity-75 border-green-200 bg-green-50" : "hover:border-orange-300"}`}
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <h4
              className={`text-lg font-bold leading-snug ${step.isCompleted ? "line-through text-slate-400" : "text-slate-900"}`}
            >
              {step.title}
            </h4>
            <span
              className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-lg whitespace-nowrap ${
                step.isCompleted
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              ~{step.estimatedDays}d
            </span>
          </div>
          <p
            className={`text-sm leading-relaxed mb-4 ${step.isCompleted ? "text-slate-500" : "text-slate-600"}`}
          >
            {step.description}
          </p>

          {step.resources?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {step.resources.map((r, i) => (
                <a
                  key={i}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-all duration-200 font-medium hover:shadow-sm"
                >
                  {r.title}
                  <FiExternalLink size={12} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapStep;
