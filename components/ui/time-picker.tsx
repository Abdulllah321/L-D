"use client";

import { useState, useRef, useEffect } from "react";
import { Clock, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function TimePicker({ value, onChange, placeholder = "Select time", className = "" }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [activeTab, setActiveTab] = useState<"start" | "end">("start");
  const containerRef = useRef<HTMLDivElement>(null);

  const formatTime = (time: string) => {
    if (!time) return "";
    // Convert 24h to 12h format
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "pm" : "am";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const parseTime = (timeInput: string) => {
    if (!timeInput) return "";
    
    // If already in 24h format (HH:MM), return as is
    const time24hMatch = timeInput.match(/^(\d{1,2}):(\d{2})$/);
    if (time24hMatch) {
      const hour = parseInt(time24hMatch[1]);
      const minutes = time24hMatch[2];
      if (hour >= 0 && hour < 24 && parseInt(minutes) >= 0 && parseInt(minutes) < 60) {
        return `${hour.toString().padStart(2, "0")}:${minutes}`;
      }
    }
    
    // Convert 12h to 24h format
    const match = timeInput.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
    if (!match) return timeInput; // Return as is if can't parse
    
    let hour = parseInt(match[1]);
    const minutes = match[2];
    const ampm = match[3].toLowerCase();
    
    if (ampm === "pm" && hour !== 12) hour += 12;
    if (ampm === "am" && hour === 12) hour = 0;
    
    return `${hour.toString().padStart(2, "0")}:${minutes}`;
  };

  useEffect(() => {
    // Parse existing value if it's in format "HH:MM - HH:MM" or "HH:MM am/pm - HH:MM am/pm"
    if (value) {
      const parts = value.split(" - ");
      if (parts.length === 2) {
        const start = parts[0].trim();
        const end = parts[1].trim();
        // Convert to 24h format if needed
        setStartTime(parseTime(start));
        setEndTime(parseTime(end));
      } else if (parts.length === 1 && parts[0].includes(":")) {
        // Single time value
        setStartTime(parseTime(parts[0].trim()));
      }
    } else {
      setStartTime("");
      setEndTime("");
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleTimeChange = (type: "start" | "end", time12h: string) => {
    const time24h = parseTime(time12h);
    if (type === "start") {
      setStartTime(time24h);
      // Auto-switch to end time selection after selecting start time
      if (time24h && !endTime) {
        setTimeout(() => setActiveTab("end"), 300);
      }
    } else {
      setEndTime(time24h);
    }
    
    if (time24h) {
      const newValue = type === "start" 
        ? `${time24h} - ${endTime || ""}`.trim()
        : `${startTime || ""} - ${time24h}`.trim();
      
      if (newValue.endsWith(" -")) {
        onChange(newValue.replace(" -", ""));
      } else {
        onChange(newValue);
      }
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time24h = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const time12h = formatTime(time24h);
        options.push({ value: time24h, label: time12h });
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const compareTime = (time1: string, time2: string) => {
    const [h1, m1] = time1.split(":").map(Number);
    const [h2, m2] = time2.split(":").map(Number);
    if (h1 !== h2) return h1 - h2;
    return m1 - m2;
  };

  const calculateDuration = (start: string, end: string): string => {
    const [h1, m1] = start.split(":").map(Number);
    const [h2, m2] = end.split(":").map(Number);
    const startMinutes = h1 * 60 + m1;
    const endMinutes = h2 * 60 + m2;
    const diff = endMinutes - startMinutes;
    if (diff < 0) return "Invalid";
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  const filteredStartOptions = timeOptions.filter(opt => 
    !endTime || compareTime(opt.value, endTime) < 0
  );
  const filteredEndOptions = timeOptions.filter(opt => 
    !startTime || compareTime(opt.value, startTime) > 0
  );

  const displayValue = () => {
    if (!value) return placeholder;
    const parts = value.split(" - ");
    if (parts.length === 2) {
      const start = formatTime(parts[0].trim());
      const end = formatTime(parts[1].trim());
      return `${start} - ${end}`;
    }
    return value;
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white flex items-center gap-2 transition-all ${
          value ? "text-gray-900 border-teal-300" : "text-gray-500"
        }`}
      >
        <Clock className={`w-4 h-4 ${value ? "text-teal-600" : "text-gray-400"}`} />
        <span className="flex-1 text-left font-medium">
          {displayValue()}
        </span>
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setStartTime("");
              setEndTime("");
              onChange("");
            }}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5 text-gray-400" />
          </button>
        )}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl p-0 w-full min-w-[360px] max-w-[400px] overflow-hidden"
              style={{
                maxHeight: 'calc(100vh - 200px)',
                top: '100%',
                bottom: 'auto',
              }}
            >
              {/* Header with tabs */}
              <div className="flex border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <button
                  type="button"
                  onClick={() => setActiveTab("start")}
                  className={`flex-1 px-5 py-3.5 text-sm font-semibold transition-all relative group ${
                    activeTab === "start"
                      ? "text-teal-700 bg-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Clock className={`w-4 h-4 ${activeTab === "start" ? "text-teal-600" : "text-gray-400"}`} />
                    <span>Start Time</span>
                  </div>
                  {activeTab === "start" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-t-full"
                    />
                  )}
                  {startTime && (
                    <div className="mt-1 text-xs font-medium text-teal-600">
                      {formatTime(startTime)}
                    </div>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("end")}
                  disabled={!startTime}
                  className={`flex-1 px-5 py-3.5 text-sm font-semibold transition-all relative group ${
                    activeTab === "end"
                      ? "text-teal-700 bg-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  } ${
                    !startTime ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <ArrowRight className={`w-4 h-4 ${activeTab === "end" ? "text-teal-600" : "text-gray-400"}`} />
                    <span>End Time</span>
                  </div>
                  {activeTab === "end" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-blue-500 rounded-t-full"
                    />
                  )}
                  {endTime && (
                    <div className="mt-1 text-xs font-medium text-teal-600">
                      {formatTime(endTime)}
                    </div>
                  )}
                </button>
              </div>

              {/* Time selection area */}
              <div className="p-5 flex flex-col" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                    {activeTab === "start" ? (
                      <>
                        <Clock className="w-4 h-4 text-teal-600" />
                        <span className="font-medium">Select when the session starts</span>
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-4 h-4 text-teal-600" />
                        <span className="font-medium">Select when the session ends</span>
                        {startTime && (
                          <span className="ml-auto text-teal-600 font-semibold bg-teal-50 px-2 py-0.5 rounded">
                            After {formatTime(startTime)}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto border border-gray-200 rounded-xl bg-gradient-to-b from-gray-50 to-white shadow-inner">
                  <div className="p-1">
                    {(activeTab === "start" ? filteredStartOptions : filteredEndOptions).map((option, index) => {
                      const isSelected = activeTab === "start" 
                        ? startTime === option.value 
                        : endTime === option.value;
                      return (
                        <motion.button
                          key={option.value}
                          type="button"
                          onClick={() => handleTimeChange(activeTab, option.label)}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.01 }}
                          className={`w-full px-4 py-3 text-sm text-left transition-all rounded-lg mb-1 last:mb-0 ${
                            isSelected
                              ? "bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold shadow-lg transform scale-[1.02]"
                              : "text-gray-700 hover:bg-white hover:shadow-md hover:text-gray-900"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-1.5 h-1.5 bg-white rounded-full"
                                />
                              )}
                              <span>{option.label}</span>
                            </span>
                            {isSelected && (
                              <motion.svg
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </motion.svg>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected time display */}
                {value && startTime && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 border-2 border-teal-200 rounded-xl shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-[80px]">
                          <div className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Start</div>
                          <div className="text-base font-bold text-teal-700 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                            {formatTime(startTime)}
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-teal-500 flex-shrink-0" />
                        <div className="text-center min-w-[80px]">
                          <div className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">End</div>
                          <div className={`text-base font-bold px-3 py-1.5 rounded-lg shadow-sm ${
                            endTime 
                              ? "text-teal-700 bg-white" 
                              : "text-gray-400 bg-gray-100"
                          }`}>
                            {endTime ? formatTime(endTime) : "—"}
                          </div>
                        </div>
                      </div>
                      {startTime && endTime && (
                        <div className="text-right ml-4 pl-4 border-l-2 border-teal-200">
                          <div className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Duration</div>
                          <div className="text-base font-bold text-gray-900 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                            {calculateDuration(startTime, endTime)}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

