const Ticket = require("../models/ticketModel");
const { v4: uuidv4 } = require("uuid");

const fetchTickets = async (req, res) => {
  try {
    // Get the user ID from the request object
    const { user_id } = req.params;
    // console.log("Finally", user_id, "===", req.userId); // debug
    // Verify that the user ID matches the authenticated user, we are setting req.userId = payload.userId during authentication.
    if (user_id !== req.userId) {
      // console.log("Hitting !=="); // debug
      return res.sendStatus(403); // Forbidden if user ID doesn't match
    }

    // Fetch the user's tickets from the database and send the response
    const tickets = await Ticket.find({ byUser: user_id });
    res.json({ status: 200, tickets });
  } catch (error) {
    res.json({ status: "error", error: "Failed to fetch tickets" });
  }
};

const createTicket = async (req, res) => {
  try {
    const { user_id } = req.params;
    const newId = uuidv4();

    if (user_id !== req.userId) {
      return res.sendStatus(403); // Forbidden if user ID doesn't match
    }
    const {
      //req.params was not working for some reason, so using the user_id received from frontend
      name,
      companyName,
      email,
      phoneNumber,
      landlineNumber,
      issue,
      classification,
      channel,
      remarks,
      resolved,
      priority,
      assignedEngineer,
    } = req.body;

    // Create a new ticket document
    const ticket = new Ticket({
      id: newId,
      byUser: user_id,
      name,
      companyName,
      email,
      phoneNumber,
      landlineNumber,
      issue,
      classification,
      channel,
      remarks,
      resolved,
      priority,
      assignedEngineer,
    });
    // Save the ticket to the database
    await ticket.save();

    res.json({ status: 200 });
  } catch (error) {
    res.status(500).json({ status: "error", error: "Failed to create ticket" });
  }
};

const updateTicket = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (user_id !== req.userId) {
      return res.sendStatus(403); // Forbidden if user ID doesn't match
    }

    const {
      name,
      companyName,
      email,
      phoneNumber,
      landlineNumber,
      issue,
      classification,
      channel,
      remarks,
      resolved,
      priority,
      assignedEngineer,
      ticket_id,
    } = req.body;

    // Assuming Ticket is your Mongoose model
    const existingTicket = await Ticket.findOneAndUpdate(
      { id: ticket_id }, // Assuming 'byUser' is the unique identifier for a ticket
      {
        name,
        companyName,
        email,
        phoneNumber,
        landlineNumber,
        issue,
        classification,
        channel,
        remarks,
        resolved,
        priority,
        assignedEngineer,
      },
      { new: true } // Return the updated document
    );

    if (!existingTicket) {
      return res
        .status(404)
        .json({ status: "error", error: "Ticket not found" });
    }

    res.json({ status: 200 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: "Failed to update ticket" });
  }
};

const fetchSingleTicket = async (req, res) => {
  try {
    //authenticating the user
    const { user_id } = req.params;
    if (user_id !== req.userId) {
      return res.sendStatus(403);
    }

    //once authenticated
    const { ticket_id } = req.params;
    const ticket = await Ticket.findOne({ id: ticket_id });
    res.json({ status: 200, ticket });
  } catch (err) {
    console.log(err);
  }
};

const updateTicketStatus = async (req, res) => {
  try {
    //authenticating the user
    const { user_id } = req.params;
    if (user_id !== req.userId) {
      return res.sendStatus(403);
    }

    //once authenticated
    const { ticket_id } = req.params;
    const filter = { id: ticket_id };
    const update = { resolved: req.body.resolved };
    const doc = await Ticket.findOneAndUpdate(filter, update, {
      new: true,
    });
    res.json({ status: 200 });
  } catch (err) {
    console.log(err);
  }
};

const addMessage = async (req, res) => {
  const { user_id } = req.params;
  const { ticket_id } = req.params;
  const { userRole, textMessage } = req.body;

  if (user_id !== req.userId) {
    return res.sendStatus(403);
  }

  const updatedTicket = await Ticket.findOneAndUpdate(
    { id: ticket_id },
    {
      $push: {
        logs: {
          timestamp: Date.now(),
          userRole: userRole,
          message: textMessage,
        },
      },
    },
    { new: true } // This option returns the updated ticket after the update
  );
  // console.log(ticket.logs);
  res.json({ status: 200 });
};

module.exports = {
  fetchTickets,
  createTicket,
  updateTicket,
  fetchSingleTicket,
  updateTicketStatus,
  addMessage,
};
