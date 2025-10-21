from typing import Dict, List

from fastapi import APIRouter, Query

router = APIRouter()

MOCK_RECOMMENDATIONS: Dict[int, List[Dict[str, str]]] = {
    1: [
        {
            "project_id": 1,
            "reason": "Perfil com foco em IA e disponibilidade remota.",
        },
        {
            "project_id": 3,
            "reason": "Experiencia em data science casa com objetivos do projeto.",
        },
    ],
    2: [
        {
            "project_id": 2,
            "reason": "Habilidades UX combinam com aplicativo de saude.",
        }
    ],
}


@router.get("/recommendations/collaborators/{collaborator_id}", tags=["match"])
def recommend_projects_for_collaborator(
    collaborator_id: int,
    limit: int = Query(default=5, ge=1, le=10),
):
    recommendations = MOCK_RECOMMENDATIONS.get(collaborator_id, [])[:limit]
    return {
        "collaborator_id": collaborator_id,
        "recommendations": recommendations,
        "source": "mock-model-v0",
    }


@router.post("/recommendations/projects/{project_id}", tags=["match"])
def recommend_collaborators_for_project(project_id: int, limit: int = 3):
    collaborators = [
        {
            "collaborator_id": idx,
            "score": round(0.8 - idx * 0.1, 2),
            "reason": "Compatibilidade heuristica com o projeto.",
        }
        for idx in range(1, limit + 1)
    ]
    return {
        "project_id": project_id,
        "recommendations": collaborators,
        "source": "heuristic-mock",
    }

