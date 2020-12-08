import asyncio
import websockets
import json

STATE = {'value':0}

users = set()

def user_event():
    return json.dumps({"type": "users", "count": len(users)})

# def user_message():
#     return json.dumps({"type":"message", "message":})


async def reg_users(websocket):
    users.add(websocket)
    await send_count_users()
    print(websocket)

async def send_count_users():
    if users:
        message = user_event()
        await asyncio.wait([user.send(message) for user in users])


async def del_users(websocket):
    users.remove(websocket)
    await send_count_users()

async def send_to_users(message):
    if users:
        message = json.dumps({"type": "message", "value": message})
        await asyncio.wait([user.send(message) for user in users])



async def server(websocket,path):
    await reg_users(websocket)


    try:
        await data(websocket)
    finally:
        await del_users(websocket)
        print(users)


async def data(websocket):
    async for message in websocket:

        await send_to_users(message)


start_server = websockets.serve(server,'192.168.0.160',5678)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
