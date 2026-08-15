from fastapi import APIRouter, Body
from app.schemas import ResearchRequest, ResearchReportResponse
from app.services.agent_orchestrator import agent_orchestrator

router = APIRouter(prefix="/v1", tags=["Autonomous Multi-Agent Engine"])

@router.post(
    "/research/start",
    summary="Launch Autonomous Multi-Agent Research Session",
    description="Triggers a multi-agent investigation state machine (Planner -> Market Agent -> Filing Agent -> News Agent -> Critic Agent -> Synthesis) and returns a source-cited intelligence report.",
    response_model=ResearchReportResponse
)
async def start_research_task(
    req: ResearchRequest = Body(..., example={"query": "Why did NVDA drop today?", "symbol": "NVDA"})
):
    report = await agent_orchestrator.run_research_pipeline(req.query, req.symbol)
    return report
