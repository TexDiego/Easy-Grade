import GradeService from "../../../Services/GradeService";

export async function loadFullGrade(id) {
  return GradeService.getGrade(id);
}
