import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const OrganizerEventCard = ({ event, onDeletion, readOnly, onPay }) => {
  const [open, setOpen] = useState(false);

  const { token } = useContext(AuthContext);
  const poster = event.posterURL || null;
  const video = event.video_url ||null;
  const title = event.title || "Untitled Event";
  const summary = event.description || "";
  const start = event.startTime || null;
  const end = event.endTime || null;
  const location = event.locationName || "TBA";
  const address = event.address || "";
  const city = event.city || "";
  const price = event.price ?? null;
  const tickets = event.tickets_available ?? null;
  const status = event.status || "upcoming";

  const formatDate = (d) => {
    if (!d) return "TBA";
    try {
      return new Date(d).toLocaleString();
    } catch (e) {
      return d;
    }
  };

  const startDate = start
    ? (() => {
        try {
          return new Date(start).toLocaleDateString();
        } catch (e) {
          return start;
        }
      })()
    : "TBA";

  const [editMode, setEditMode] = useState(false);
  const [local, setLocal] = useState({});
  const [playOnOpen, setPlayOnOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState(1);

  React.useEffect(() => {
    setLocal({
      title: event.title || "",
      description: event.description || "",
      locationName: event.locationName || "",
      address: event.address || "",
      city: event.city || "",
      price: event.price ?? "",
      tickets_available: event.tickets_available ?? "",
      startTime: event.startTime || "",
      endTime: event.endTime || "",
      status: event.status || "upcoming",
    });
  }, []);

  const handleUpdate = async () => {
    const updated = {};
    Object.keys(local).forEach((key) => {
      if (local[key] !== event[key]) {
        updated[key] = local[key];
      }
    });
    if (updated.price !== undefined) {
      updated.price = Number(updated.price);
    }
    if (updated.tickets_available !== undefined) {
      updated.tickets_available = Number(updated.tickets_available);
    }
    if (updated.startTime) {
      try {
        updated.startTime = new Date(updated.startTime).toISOString();
      } catch (e) {
        console.warn("Invalid startTime:", updated.startTime);
      }
    }
    if (updated.endTime) {
      try {
        updated.endTime = new Date(updated.endTime).toISOString();
      } catch (e) {
        console.warn("Invalid endTime:", updated.endTime);
      }
    }

    if (Object.keys(updated).length === 0) {
      console.log("No changes detected");
      setEditMode(false);
      return;
    }

    try {
      if (!token) throw new Error("Missing auth token");

      const payload = { ...updated, id: event.id };
      console.log("Sending payload:", payload);

      const resp = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/event/update-event`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await resp.json();

      if (!resp.ok) {
        throw new Error(responseData.error || "Failed to update event");
      }

      console.log("Update successful:", responseData.event);

      window.dispatchEvent(
        new CustomEvent("event-updated", {
          detail: { id: event.id, event: responseData.event },
        })
      );
      setEditMode(false);
      setOpen(false);
    } catch (e) {
      console.error("Update error:", e.message);
    }
    setEditMode(false);
  };

  const handleDelete = async () => {
    if (!token) throw new Error("Missing auth token");
    const ok = window.confirm(
      "Delete this event? This action cannot be undone."
    );
    if (!ok) return;
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/event/delete-event`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: event.id }),
        }
      );
      if (!resp.ok) {
        throw new Error("Failed to delete event");
      }
      onDeletion(event.id);
      alert("Event deleted successfully");
      window.dispatchEvent(
        new CustomEvent("event-deleted", {
          detail: { id: event.id },
        })
      );
      setEditMode(false);
      setOpen(false);
    } catch (err) {
      console.error("delete failed", err);
      alert("Failed to delete event. See console for details.");
    }
  };

  return (
    <>
      <div
        className="bg-gradient-to-b from-gray-800/10 to-gray-800/5 border border-gray-700/40 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 cursor-pointer"
        onClick={() => { setOpen(true); setSelectedMedia(null); }}
        aria-hidden="true"
      >
        <div className="relative h-40 w-full">
          {poster ? (
            <div className="w-full h-full relative">
              <img src={poster} alt={title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">{video ? (
              <div className="w-full h-full">
                <video src={video} className="w-full h-full object-cover" muted playsInline />
              </div>
            ) : (
              'No Image'
            )}</div>
          )}

          {/* overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

          {/* status badge */}
          <div className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold bg-black/50 text-white backdrop-blur">
            {status.toUpperCase()}
          </div>

          {/* price pill */}
          <div className="absolute right-3 top-3 rounded-full px-3 py-1 text-sm font-semibold bg-orange-500/95 text-white shadow">
            {price ? `₹${price}` : "FREE"}
          </div>

          {/* title overlay */}
          <div className="absolute left-4 bottom-3 right-4">
            <h3 className="text-white text-lg font-bold drop-shadow-md">
              {title}
            </h3>
            <p className="text-gray-200 text-sm mt-1 line-clamp-1">
              {location}
            </p>
            <div className="mt-2">
              <span className="inline-block bg-black/50 text-xs text-white px-2 py-1 rounded">
                {startDate}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-300 line-clamp-2">{summary}</p>

          <div className="mt-3 flex items-center justify-between">
            <div />
            <div className="ml-auto flex items-center gap-2">
              <div className="text-xs bg-gray-800/60 text-gray-100 px-2 py-1 rounded-md">
                {tickets ?? "N/A"} tickets
              </div>
              <div className="text-xs bg-gray-800/60 text-gray-100 px-2 py-1 rounded-md">
                {city || "—"}
              </div>
            </div>
          </div>

          {/* small decorative progress bar placeholder */}
          <div className="mt-3">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-orange-500"
                style={{ width: `${tickets ? Math.min(100, 40) : 6}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div
          onClick={() => { setOpen(false); setPlayOnOpen(false); setSelectedMedia(null); }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl"
            role="dialog"
            aria-modal="true"
          >
            <div className="md:flex">
              <div className="md:w-1/2 w-full">
                {selectedMedia
                  ? (selectedMedia.type === 'video'
                      ? <video controls src={selectedMedia.url} className="w-full h-56 md:h-full object-cover" />
                      : <img src={selectedMedia.url} alt={title} className="w-full h-56 md:h-full object-cover" />)
                  : (poster
                      ? <img src={poster} alt={title} className="w-full h-56 md:h-full object-cover" />
                      : <div className="w-full h-56 flex items-center justify-center text-gray-500">No Image</div>
                    )
                }
              </div>

              <div className="md:w-1/2 w-full p-6 flex flex-col">
                <div className="flex items-start justify-between">
                  <div>
                    {!editMode ? (
                      <>
                        <h2 className="text-2xl font-bold text-white">
                          {title}
                        </h2>
                        <div className="text-xs text-gray-400 mt-1">
                          Event ID:{" "}
                          <span className="text-gray-300">{event.id}</span>
                        </div>
                      </>
                    ) : (
                      <div>
                        <input
                          value={local.title}
                          onChange={(e) =>
                            setLocal((p) => ({ ...p, title: e.target.value }))
                          }
                          className="bg-gray-800 text-white px-2 py-1 rounded w-full"
                        />
                        <div className="text-xs text-gray-400 mt-1">
                          Event ID:{" "}
                          <span className="text-gray-300">{event.id}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!readOnly && (
                      !editMode ? (
                        <button
                          onClick={() => setEditMode(true)}
                          className="text-orange-400"
                        >
                          Edit
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setLocal({
                                title: event.title || "",
                                description: event.description || "",
                                locationName: event.locationName || "",
                                address: event.address || "",
                                city: event.city || "",
                                price: event.price ?? "",
                                tickets_available: event.tickets_available ?? "",
                                startTime: event.startTime || "",
                                endTime: event.endTime || "",
                                status: event.status || "upcoming",
                              });
                              setEditMode(false);
                            }}
                            className="text-gray-300"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleUpdate}
                            className="bg-orange-500 text-white px-3 py-1 rounded"
                          >
                            Save
                          </button>
                        </>
                      )
                    )}
                  </div>
                </div>

                <div className="mt-4 text-gray-300 flex-1">
                  {!editMode ? (
                    <p className="mb-3">{event.longDescription || summary}</p>
                  ) : (
                    <textarea
                      value={local.description || local.longDescription || ""}
                      onChange={(e) =>
                        setLocal((p) => ({
                          ...p,
                          description: e.target.value,
                          longDescription: e.target.value,
                        }))
                      }
                      className="w-full bg-gray-800 text-white p-2 rounded mb-3 h-28"
                    />
                  )}

                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-400">
                    <div>
                      <div className="text-xs text-gray-500">Venue</div>
                      {!editMode ? (
                        <div className="text-gray-200">{location}</div>
                      ) : (
                        <input
                          value={local.locationName || ""}
                          onChange={(e) =>
                            setLocal((p) => ({
                              ...p,
                              locationName: e.target.value,
                            }))
                          }
                          className="w-full bg-gray-800 text-white px-2 py-1 rounded"
                        />
                      )}
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">City</div>
                      {!editMode ? (
                        <div className="text-gray-200">{city || "—"}</div>
                      ) : (
                        <input
                          value={local.city || ""}
                          onChange={(e) =>
                            setLocal((p) => ({ ...p, city: e.target.value }))
                          }
                          className="w-full bg-gray-800 text-white px-2 py-1 rounded"
                        />
                      )}
                    </div>

                    <div>
                      <div className="text-xs text-gray-500">Address</div>
                      {!editMode ? (
                        <div className="text-gray-200">{address || "—"}</div>
                      ) : (
                        <input
                          value={local.address || ""}
                          onChange={(e) =>
                            setLocal((p) => ({ ...p, address: e.target.value }))
                          }
                          className="w-full bg-gray-800 text-white px-2 py-1 rounded"
                        />
                      )}
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Tickets</div>
                      {!editMode ? (
                        <div className="text-gray-200">{tickets ?? "N/A"}</div>
                      ) : (
                        <input
                          type="number"
                          value={local.tickets_available ?? ""}
                          onChange={(e) =>
                            setLocal((p) => ({
                              ...p,
                              tickets_available: e.target.value,
                            }))
                          }
                          className="w-full bg-gray-800 text-white px-2 py-1 rounded"
                        />
                      )}
                    </div>

                    <div>
                      <div className="text-xs text-gray-500">Price</div>
                      {!editMode ? (
                        <div className="text-gray-200">
                          {price ? `₹${price}` : "FREE"}
                        </div>
                      ) : (
                        <input
                          type="number"
                          value={local.price ?? ""}
                          onChange={(e) =>
                            setLocal((p) => ({ ...p, price: e.target.value }))
                          }
                          className="w-full bg-gray-800 text-white px-2 py-1 rounded"
                        />
                      )}
                    </div>

                    <div>
                      <div className="text-xs text-gray-500">Status</div>
                      {!editMode ? (
                        <div className="text-gray-200">{status}</div>
                      ) : (
                        <select
                          value={local.status || "upcoming"}
                          onChange={(e) =>
                            setLocal((p) => ({ ...p, status: e.target.value }))
                          }
                          className="w-full bg-gray-800 text-white px-2 py-1 rounded"
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="ongoing">Ongoing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      )}
                    </div>

                    <div>
                      <div className="text-xs text-gray-500">Start</div>
                      {!editMode ? (
                        <div className="text-gray-200">{formatDate(start)}</div>
                      ) : (
                        <input
                          type="datetime-local"
                          value={
                            local.startTime
                              ? local.startTime.substring(0, 16)
                              : ""
                          }
                          onChange={(e) =>
                            setLocal((p) => ({
                              ...p,
                              startTime: e.target.value,
                            }))
                          }
                          className="w-full bg-gray-800 text-white px-2 py-1 rounded"
                        />
                      )}
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">End</div>
                      {!editMode ? (
                        <div className="text-gray-200">
                          {end ? formatDate(end) : "—"}
                        </div>
                      ) : (
                        <input
                          type="datetime-local"
                          value={
                            local.endTime ? local.endTime.substring(0, 16) : ""
                          }
                          onChange={(e) =>
                            setLocal((p) => ({ ...p, endTime: e.target.value }))
                          }
                          className="w-full bg-gray-800 text-white px-2 py-1 rounded"
                        />
                      )}
                    </div>
                  </div>

                  {( (event.images_url && event.images_url.length > 0) || video ) && (
                    <div className="mt-4">
                      <h4 className="text-sm text-gray-200 mb-2">Gallery</h4>
                      <div className="flex gap-2 overflow-x-auto py-1 -mx-1">
                        {
                          // build gallery items: include video first if present, then images
                          (() => {
                            const imgs = event.images_url && event.images_url.length ? event.images_url : [];
                            const items = [];
                            if (video) items.push({ type: 'video', url: video });
                            imgs.forEach((u) => items.push({ type: 'image', url: u }));
                            return items.map((it, idx) => (
                              <div key={idx} className="flex-none w-32 h-20 relative">
                                {it.type === 'video' ? (
                                  <button onClick={(e) => { e.stopPropagation(); setSelectedMedia(it); setPlayOnOpen(true); }} className="w-full h-full">
                                    <video src={it.url} muted playsInline className="w-full h-full object-cover rounded" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-8 h-8 bg-black/60 rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                      </div>
                                    </div>
                                  </button>
                                ) : (
                                  <button onClick={(e) => { e.stopPropagation(); setSelectedMedia(it); }} className="w-full h-full">
                                    <img src={it.url} alt={`img-${idx}`} className="w-full h-full object-cover rounded" />
                                  </button>
                                )}
                              </div>
                            ));
                          })()
                        }
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center gap-3">
                  {readOnly ? (
                    <>
                      <label className="text-sm text-gray-300 mr-2" htmlFor={`tickets-${event.id}`}>Tickets:</label>
                      <input
                        id={`tickets-${event.id}`}
                        type="number"
                        min={1}
                        max={tickets || 10}
                        value={selectedTickets || 1}
                        onChange={e => setSelectedTickets(Math.max(1, Math.min(Number(e.target.value), tickets || 10)))}
                        className="w-20 px-2 py-1 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="Tickets"
                      />
                      <button
                        className="px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow"
                        onClick={() => {alert(`Proceed to pay ₹${price * (selectedTickets || 1)}`);
                                        onPay(event.id, selectedTickets || 1);}}
                        disabled={!price || (tickets !== null && tickets < 1)}
                      >
                        Pay ₹{price * (selectedTickets || 1)}
                      </button>
                      <button
                        className="px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-200"
                        onClick={() => { setOpen(false); setPlayOnOpen(false); setSelectedMedia(null); }}
                      >
                        Close
                      </button>
                    </>
                  ) : (
                    <>
                      {!readOnly && (
                        <button
                          className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
                          onClick={handleDelete}
                        >
                          Delete
                        </button>
                      )}
                      <button
                        className="px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-200"
                        onClick={() => { setOpen(false); setPlayOnOpen(false); setSelectedMedia(null); }}
                      >
                        Close
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrganizerEventCard;
