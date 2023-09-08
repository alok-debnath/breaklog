export default function UserProfile({params}:any) {
    return (
        <>
            <h1>Profile</h1>
            <p>{params.id}</p>
        </>
    )
}