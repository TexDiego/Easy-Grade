import { useEffect, useState } from "react";
import { loadFullGrade } from "../services/gradeService";

export function UseGradeData(id) {

  const [currentGrade, setCurrentGrade] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {

      const data = await loadFullGrade(id);

      setCurrentGrade(data);
      setLoading(false);
    }

    load();

  }, [id]);

  return {
    currentGrade,
    setCurrentGrade,
    loading
  };
}