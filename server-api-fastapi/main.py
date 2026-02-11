# filepath: /server-api-fastapi/main.py
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import datetime
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime as dt


load_dotenv()

app = FastAPI()

client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
db = client[os.getenv("MONGO_DB")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://temp.mgelsk.com", "http://localhost:5173"]
)
# Define the data model for the insert request
class TempData(BaseModel):
    temperature: float
    humidity: float
    outdoor: Optional[float] = None
    token: str
    table: str = "bedroom"  # Default room is "bedroom"

async def cleanup_records(collection_name: str, max_records: int = int(os.getenv("MAX_RECORDS"))):
    collection = db[collection_name]
    record_count = await collection.count_documents({})

    if record_count > max_records:
        # Calculate the number of records to delete
        excess_records = record_count - max_records

        # Find the oldest records to delete
        records_to_delete = await collection.find().sort("date", 1).limit(excess_records).to_list(length=excess_records)
        ids_to_delete = [record["_id"] for record in records_to_delete]
        # Delete the oldest records
        await collection.delete_many({"_id": {"$in": ids_to_delete}})

@app.get("/temp/rooms")
async def get_rooms():
    # Get all collections in the database
    collections = await db.list_collection_names()
    return {"rooms": collections}

@app.post("/temp/insert")
async def insert_temp(data: TempData):
    # Check if the token is valid
    if data.token != os.getenv("API_TOKEN"):
        return {"message": "Invalid token"}

    collection = db[data.table]
    
    data_dict = data.model_dump()

    data_dict["date"] = dt.now(datetime.timezone.utc)  # Add the current timestamp

    del data_dict["token"]  # Remove the token from the data
    del data_dict["table"] # Remove the room from the data
    if data_dict.get("outdoor") is None:
        del data_dict["outdoor"]
    # Insert the data into the MongoDB collection
    result = await collection.insert_one(data_dict)

    if result.inserted_id:
        #await cleanup_records(data.table)
        return {"message": "Data inserted successfully", "id": str(result.inserted_id)}
    else:
        raise HTTPException(status_code=500, detail="Failed to insert data")

@app.get("/temp/get")
async def get_temp(
    from_date: str = Query(None),
    before_date: str = Query(None),
    count: int = Query(10),
    room: str = Query("bedroom"),
    statistics: bool = Query(True),
    units: str = Query("fahrenheit"),
):
    collection = db[room]
    query = {}

    if from_date or before_date:
        query["date"] = {}
        if from_date:
            try:
                query["date"]["$gte"] = dt.strptime(from_date, "%Y-%m-%d")
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid from_date format. Use YYYY-MM-DD.")
        if before_date:
            try:
                query["date"]["$lte"] = dt.strptime(before_date, "%Y-%m-%d")
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid before_date format. Use YYYY-MM-DD.")
    
    if count > 4000:
        raise HTTPException(status_code=400, detail="Count cannot exceed 4000.")

    cursor = collection.find(query).sort("_id", -1).limit(count)
    results = await cursor.to_list(length=count)

    for result in results:
        del result["_id"]
    if units == "fahrenheit":
        for result in results:
            result["temperature"] = round(result["temperature"] * 9 / 5 + 32, 1)
            if "outdoor" in result:
                result["outdoor"] = round(result["outdoor"] * 9 / 5 + 32, 1)
    response = {"results": results}
    if statistics:
        response["stats"] = calculate_stats(results, units)

    return response

def calculate_stats(data, units):
    temperatures = [row["temperature"] for row in data]
    humidities = [row["humidity"] for row in data]

    return {
        "average_temp": round(sum(temperatures) / len(temperatures), 1) if temperatures else None,
        "high_temp": round(max(temperatures), 1) if temperatures else None,
        "low_temp": round(min(temperatures), 1) if temperatures else None,
        "average_humid": round(sum(humidities) / len(humidities), 1) if humidities else None,
        "high_humid": round(max(humidities), 1) if humidities else None,
        "low_humid": round(min(humidities), 1) if humidities else None,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
